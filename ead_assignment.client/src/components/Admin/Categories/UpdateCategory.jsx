import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { MdModeEditOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const UpdateCategory = ({ onClose, categoryData, onUpdate }) => {
  const { userData } = useContext(UserContext);
  const [categoryName, setCategoryName] = useState(categoryData.name || "");
  const [categoryDescription, setCategoryDescription] = useState(
    categoryData.description || ""
  );
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState({
    categoryName: false,
    categoryDescription: false,
  });

  const handleEditToggle = async (field) => {
    if (isEditing[field]) {
      await handleSubmit();
    }
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        Name: categoryName,
        Description: categoryDescription,
        IsActivated: categoryData.isActivated, // Include if needed
      };

      const response = await axios.put(
        `/api/categories/${categoryData.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Category updated successfully!");
      } else {
        setMessage("Failed to update category.");
      }
      onUpdate();
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("Error updating category.");
    }
  };

  const resetForm = () => {
    setCategoryName(categoryData.name || "");
    setCategoryDescription(categoryData.description || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const toggleDrawer = () => {
    onClose();
    resetForm();
  };

  return (
    <Col>
      <button
        style={{
          position: "absolute",
          top: "-8px",
          right: "0px",
          background: "none",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={toggleDrawer}
      >
        &times;
      </button>
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
              <div style={{ marginLeft: "90px" }}>Update Category</div>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="categoryName">
                  <Form.Label>Category Name</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      readOnly={!isEditing.categoryName}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("categoryName")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.categoryName ? (
                        <FaCheck />
                      ) : (
                        <MdModeEditOutline />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="categoryDescription">
                  <Form.Label>Category Description</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Category Description"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      readOnly={!isEditing.categoryDescription}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("categoryDescription")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.categoryDescription ? (
                        <FaCheck />
                      ) : (
                        <MdModeEditOutline />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
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

export default UpdateCategory;
