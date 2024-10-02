import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import {
  Table,
  DropdownButton,
  Dropdown,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { LuRefreshCcw } from "react-icons/lu";
import { sendConfirmation } from "../../Services/Email";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const Requests = () => {
  const { userData } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/requests", {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      const requestsData = response.data;
      setRequests(requestsData);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch role requests
  useEffect(() => {
    fetchRequests();
  }, [userData.token]);

  const handleApprove = async (requestId, approve) => {
    try {
      const request = requests.find((req) => req.id === requestId);

      await axios.put(
        `/api/requests/${requestId}/approve`,
        { approve },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      // Send confirmation email
      const message = approve
        ? `Your request to be a ${request.requestedRole} is approved.`
        : `Your request to be a ${request.requestedRole} is rejected.`;

      const toast = approve
        ? `Request to be a ${request.requestedRole} is approved.`
        : `Request to be a ${request.requestedRole} is rejected.`;

      sendConfirmation(request.userName, request.email, message);
      setMessage(toast);

      // Refresh the request list
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error("Error approving/rejecting request:", error);
      setError("Failed to process the request.");
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearchQuery =
      request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      !selectedRole ||
      request.requestedRole.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearchQuery && matchesRole;
  });

  return (
    <div style={{ marginTop: "5px" }}>
      <div
        className="icon-container justify-content-between"
        style={{ fontSize: "18px", fontWeight: "bold" }}
      >
        <div>
          <LuRefreshCcw onClick={fetchRequests} style={{ cursor: "pointer" }} />
        </div>

        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <Form.Control
            type="text"
            placeholder="Search requests"
            className="mx-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* filter requests by role */}
          <DropdownButton
            id="dropdown-basic-button"
            title={selectedRole ? `${selectedRole}` : "Filter by role"}
            variant="secondary"
            onSelect={(role) => setSelectedRole(role)}
          >
            <Dropdown.Item eventKey="">All</Dropdown.Item>
            <Dropdown.Item eventKey="Vendor">Vendor</Dropdown.Item>
            <Dropdown.Item eventKey="CSR">CSR</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      {error && (
        <Alert variant="danger">
          <p>{error}</p>
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>User</th>
              <th>Email</th>
              <th>Requested Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.userName}</td>
                  <td>{request.email}</td>
                  <td>{request.requestedRole}</td>
                  <td className="d-flex">
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleApprove(request.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleApprove(request.id, false)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <ToastContainer
        className="p-4"
        position="bottom-end"
        style={{ zIndex: 1 }}
      >
        {message && (
          <Toast
            style={{
              color: "white",
              backgroundColor: "#212529",
            }}
          >
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </div>
  );
};

export default Requests;
