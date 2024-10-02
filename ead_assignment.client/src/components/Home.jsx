import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { requestRolesMail } from "../Services/Email";
import {
  Container,
  Button,
  Form,
  Alert,
  Spinner,
  Col,
  Row,
} from "react-bootstrap";
import { FaUserTie, FaInfoCircle } from "react-icons/fa";

const Home = () => {
  const { userData } = useContext(UserContext);
  const [requestedRole, setRequestedRole] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPendingRequest, setIsPendingRequest] = useState(false);

  // Check user request status
  const checkPendingRequest = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/requests/user/${userData.userId}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      // If status is pending
      if (response.data && response.data.status === "Pending") {
        setIsPendingRequest(true);
      }
    } catch (error) {
      console.error("Error checking pending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPendingRequest();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRequestSubmit = async () => {
    try {
      setIsLoading(true);

      // Submit role request
      const response = await axios.post(
        "/api/requests/submit",
        { role: requestedRole },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      // Notify the admin
      await requestRolesMail(userData.userName, userData.email, requestedRole);

      // Set success message
      setMessage("Role request submitted and confirmation email sent.");
      setIsPendingRequest(true);
    } catch (error) {
      setMessage("Error submitting request or sending confirmation email.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {message && (
            <Alert
              variant={message.includes("Error") ? "danger" : "success"}
              className="mt-3"
            >
              {message}
            </Alert>
          )}
          {isPendingRequest ? (
            <Alert variant="info">
              <h4>Your request is pending</h4>
              <p>
                Thank you for submitting your role request. The admin will
                review it shortly. Please check your email for further updates.
              </p>
            </Alert>
          ) : (
            <Row>
              <Col md={8}>
                <div style={{ padding: "20px" }}>
                  <h4>
                    <FaInfoCircle
                      className="me-3"
                      style={{ color: "#23474a" }}
                    />
                    Important Instructions
                  </h4>
                  <p>
                    To start using the full features of our platform, you need
                    to request a specific role that matches your activity:
                  </p>
                  <ul>
                    <li>
                      <strong>Vendor:</strong> Allows you to sell products on
                      our platform.
                    </li>
                    <li>
                      <strong>CSR (Customer Service Representative):</strong>{" "}
                      Enables you to handle customer support and inquiries.
                    </li>
                  </ul>
                  <p>
                    After submitting your request, the admin will review it. You
                    will receive a confirmation email once your role is
                    approved.
                  </p>
                </div>
              </Col>
              <Col
                md={4}
                className="p-4"
                style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
              >
                <h3 className="text-center" style={{ color: "#23474a" }}>
                  <FaUserTie className="me-2 mb-2" />
                  Request a Role
                </h3>
                <Form>
                  <Form.Group controlId="roleSelect">
                    <Form.Label>Select a Role</Form.Label>
                    <Form.Control
                      as="select"
                      value={requestedRole}
                      onChange={(e) => setRequestedRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="Vendor">Vendor</option>
                      <option value="CSR">CSR</option>
                    </Form.Control>
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleRequestSubmit}
                    disabled={isLoading || !requestedRole}
                    block
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </Button>
                </Form>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
