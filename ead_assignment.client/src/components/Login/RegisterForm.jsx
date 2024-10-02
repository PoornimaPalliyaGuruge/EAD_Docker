import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Input validation
    if (!email) {
      setError("Email cannot be empty.");
      return;
    }

    if (!username) {
      setError("Username cannot be empty.");
      return;
    }

    // Check for spaces in username
    if (/\s/.test(username)) {
      setError("Username cannot contain spaces.");
      return;
    }

    if (!fullName) {
      setError("Full name cannot be empty.");
      return;
    }

    // NIC validation
    if (!nic) {
      setError("NIC cannot be empty.");
      return;
    }

    if (!role) {
      setError("Please select a role.");
      return;
    }

    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          fullName,
          nic,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else if (data.message === "User already exists.") {
        setError(
          "An account with this email already exists. Please try logging in."
        );
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An unexpected error occurred during registration. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <br />
      <Form style={{ width: "80%", marginLeft: "10%" }} onSubmit={handleSubmit}>
        <h1>Register</h1>

        {/* Display error alert */}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formNic">
          <Form.Label>NIC</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your NIC number"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          type="submit"
          className="mt-3"
          style={{
            backgroundColor: "#33787F",
            display: "flex",
            alignItems: "center",
          }}
          disabled={loading}
        >
          Register
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="ms-2"
            />
          )}
        </Button>
      </Form>
      <p style={{ marginLeft: "10%", marginTop: "10px" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#33787F" }}>
          Login here
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
