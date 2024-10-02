import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserData, setIsAuthenticated } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        data = { message: text };
        console.log("Error: " + text);
      }

      if (response.ok) {
        const userData = {
          userId: data.userId,
          userName: data.userName,
          fullName: data.fullName,
          role: data.roles,
          token: data.accessToken,
          email: data.email,
          nic: data.nic,
          success: data.success,
        };
        console.log("Roles:", data.roles);

        // Save user data to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        setUserData(userData);
        setIsAuthenticated(true);

        // Redirect based on role
        if (
          userData.role.some((role) => role.toLowerCase() === "administrator")
        ) {
          navigate("/admin");
        } else if (
          userData.role.some((role) => role.toLowerCase() === "vendor")
        ) {
          navigate("/products");
        } else {
          navigate("/home");
        }
      } else {
        // Set more specific error message if it's available
        setError(
          data.message || "Login failed. Please check your email and password."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form
        style={{
          width: "80%",
          margin: "10% auto",
          padding: "2rem",
          border: "1px solid #eaeaea",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4">Login to Your Account</h2>

        {/* Display error alert */}
        {error && (
          <Alert variant="danger">
            {error.includes("Invalid email or password")
              ? "The email or password you entered is incorrect. Please check your credentials and try again."
              : error}
          </Alert>
        )}

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            isInvalid={!!error && error.includes("email")}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            isInvalid={!!error && error.includes("password")}
          />
          <Form.Control.Feedback type="invalid">
            Password cannot be empty.
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          type="submit"
          className="mt-3"
          style={{ backgroundColor: "#33787F", width: "100%" }}
          disabled={loading} // Disable button while loading
        >
          Login
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

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#33787F" }}>
            Register here
          </a>
        </p>
      </Form>
    </div>
  );
};

export default LoginForm;
