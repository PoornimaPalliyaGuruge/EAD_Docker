import React, { useContext, useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Alert } from "react-bootstrap";
import { MdModeEditOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import InputGroup from "react-bootstrap/InputGroup";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { UserContext } from "../context/UserContext";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState({
    userName: false,
    fullName: false,
    email: false,
  });

  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  //set alert timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  //Password Reset
  const handlePasswordReset = () => {
    setIsResetPasswordVisible(true);
  };

  //Time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString();
  };

  //Password Reset
  const handleSubmitPassword = async () => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully!");
        setIsResetPasswordVisible(false);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleInputChange = (e, field) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  //Profile Delete
  const handleProfileDelete = async () => {
    Swal.fire({
      icon: "question",
      title: "Profile Deletion",
      text: "Are you sure you want to delete your profile?",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/delete-user", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          });

          const result = await response.json();
          if (response.ok) {
            setMessage("User deleted successfully.");
            localStorage.removeItem("userData");
            window.location.href = "/login"; // Redirect to login page
          } else {
            setMessage(result.message || "Failed to delete user.");
          }
        } catch (error) {
          console.error("Error deleting profile:", error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setMessage("Profile deletion cancelled.");
      }
    });
  };

  const handleEditToggle = async (field) => {
    if (isEditing[field]) {
      await handleProfileUpdate(field);
    }

    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Update Profile Fields
  const handleProfileUpdate = async (field) => {
    try {
      const updatedField = { [field]: userData[field] };

      const response = await fetch("/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(updatedField),
      });

      const result = await response.json();
      const updateField = field.charAt(0).toUpperCase() + field.slice(1);
      if (response.ok) {
        setMessage(`${updateField} updated successfully!`);
      } else {
        setMessage(result.message || `Failed to update ${field}.`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  return (
    <Col>
      <h4 style={{ color: "white", marginLeft: "15px", marginTop: "15px" }}>
        {formatTime(currentTime)}
      </h4>
      <Row className="justify-content-center mt-4">
        <Col md={11}>
          <Card
            style={{
              backgroundColor: "RGB(44, 103, 107)",
              color: "white",
            }}
          >
            <Card.Header
              as="h5"
              className="d-flex justify-content-between align-items-center"
              style={{ fontWeight: "bold" }}
            >
              <div style={{ marginLeft: "75px" }}>Profile Information</div>
              <div style={{ marginLeft: "auto" }}>
                <RiDeleteBin5Fill
                  style={{ cursor: "pointer" }}
                  onClick={handleProfileDelete}
                />
              </div>
            </Card.Header>

            <Card.Body>
              <Form>
                <Form.Group controlId="formUserName">
                  <Form.Label>UserName</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={userData?.userName || ""}
                      onChange={(e) => handleInputChange(e, "userName")}
                      readOnly={!isEditing.userName}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("userName")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.userName ? <FaCheck /> : <MdModeEditOutline />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {/* Full Name */}
                <Form.Group controlId="formFullName" className="mt-3">
                  <Form.Label>Full Name</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      value={userData?.fullName || ""}
                      onChange={(e) => handleInputChange(e, "fullName")}
                      readOnly={!isEditing.fullName}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("fullName")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.fullName ? <FaCheck /> : <MdModeEditOutline />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={userData?.email || ""}
                      onChange={(e) => handleInputChange(e, "email")}
                      readOnly={!isEditing.email}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("email")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.email ? <FaCheck /> : <MdModeEditOutline />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {/* NIC */}
                <Form.Group controlId="formNIC" className="mt-3">
                  <Form.Label>NIC</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter NIC"
                    value={userData?.nic || ""}
                    readOnly
                  />
                </Form.Group>

                {/* Role */}
                <Form.Group controlId="formRole" className="mt-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter role"
                    value={
                      userData?.role
                        ?.map((role) => role.toUpperCase())
                        .join(", ") || ""
                    }
                    readOnly
                  />
                </Form.Group>

                {isResetPasswordVisible && (
                  <>
                    <Row className="mt-3">
                      <Col md={6}>
                        <Form.Group controlId="formCurrentPassword">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="formNewPassword">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}

                <div className="d-flex justify-content-center">
                  {!isResetPasswordVisible ? (
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={handlePasswordReset}
                    >
                      Reset Password
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={handleSubmitPassword}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
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
        </Col>
      </Row>
    </Col>
  );
};

export default UserProfile;
