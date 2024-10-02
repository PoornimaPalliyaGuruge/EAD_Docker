import React, { useEffect, useState } from "react";
import {
  Table,
  DropdownButton,
  Dropdown,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { GrUserAdmin } from "react-icons/gr";
import { IoIosBusiness } from "react-icons/io";
import { FaUsers, FaHandsHelping } from "react-icons/fa";
import UserCountCard from "../Common/UserCountCard";

const AssignUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleCounts, setRoleCounts] = useState({
    admin: 0,
    vendor: 0,
    csr: 0,
    user: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (!storedUserData || !storedUserData.token) {
        setError("User is not authenticated");
        return;
      }

      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${storedUserData.token}`,
        },
      });

      const usersData = response.data;
      setUsers(usersData);

      // Count users by roles
      const roleCounts = { admin: 0, vendor: 0, csr: 0, user: 0 };
      usersData.forEach((user) => {
        if (user.roles.includes("administrator")) roleCounts.admin += 1;
        if (user.roles.includes("vendor")) roleCounts.vendor += 1;
        if (user.roles.includes("csr")) roleCounts.csr += 1;
        if (user.roles.includes("user")) roleCounts.user += 1;
      });

      setTotalUsers(usersData.length);

      setRoleCounts(roleCounts);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (!storedUserData || !storedUserData.token) {
        setError("User is not authenticated");
        return;
      }

      const response = await axios.get("/api/users/roles", {
        headers: {
          Authorization: `Bearer ${storedUserData.token}`,
        },
      });

      setRoles(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Failed to fetch roles");
    }
  };

  // Assign role to a user
  const assignRole = async (email, role) => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (!storedUserData || !storedUserData.token) {
        setError("User is not authenticated");
        return;
      }

      // Set loading state for the specific user
      setLoadingAssign((prevState) => ({ ...prevState, [email]: true }));

      await axios.post(
        "/api/users/assign",
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${storedUserData.token}`,
          },
        }
      );
      console.log(`Assigned role ${role} to ${email}`);

      // Fetch users again after assigning a role
      fetchUsers();
    } catch (err) {
      console.error("Error assigning role:", err);
      setError("Failed to assign role");
    } finally {
      setLoadingAssign((prevState) => ({ ...prevState, [email]: false }));
    }
  };

  // Filter users based on search query and selected role
  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      !selectedRole || user.roles.includes(selectedRole.toLowerCase());

    return matchesSearchQuery && matchesRole;
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div style={{ marginTop: "5px" }}>
      {/* Search Bar and Role Filter */}
      <div className="d-flex justify-content-end mb-3">
        <Form.Control
          type="text"
          placeholder="Search users"
          className="w-25 mx-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedRole ? `${selectedRole}` : "Filter role"}
          variant="secondary"
          onSelect={(role) => setSelectedRole(role)}
        >
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {roles.map((role) => (
            <Dropdown.Item key={role.id} eventKey={role.name}>
              {role.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      {/* User counts */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
          marginTop: "10px",
        }}
      >
        <UserCountCard
          icon={<GrUserAdmin />}
          title="Admins"
          count={roleCounts.admin}
        />
        <UserCountCard
          icon={<IoIosBusiness />}
          title="Vendors"
          count={roleCounts.vendor}
        />
        <UserCountCard
          icon={<FaHandsHelping />}
          title="CSRs"
          count={roleCounts.csr}
        />
        <UserCountCard
          icon={<FaUsers />}
          title="Total Users"
          // count={roleCounts.user}
          count={totalUsers - 1}
        />
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
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers
                .filter(
                  (user) =>
                    user.email !==
                    JSON.parse(localStorage.getItem("userData")).email
                )
                .map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.userName}</td>
                    <td className="d-flex align-items-center">
                      <DropdownButton
                        id="dropdown-basic-button"
                        title={
                          user.roles.length > 0 ? user.roles[0] : "Assign Role"
                        }
                        onSelect={(role) => assignRole(user.email, role)}
                        variant="secondary"
                        disabled={loadingAssign[user.email]}
                      >
                        {roles.map((role) => (
                          <Dropdown.Item key={role.id} eventKey={role.name}>
                            {role.name}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>

                      {loadingAssign[user.email] && (
                        <Spinner
                          animation="border"
                          size="sm"
                          className="ms-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AssignUsers;
