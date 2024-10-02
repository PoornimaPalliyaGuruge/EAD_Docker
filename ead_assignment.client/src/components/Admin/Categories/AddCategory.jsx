import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";

const AddCategory = ({ onClose }) => {
  const { userData } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isActivated, setIsActivated] = useState(true);

  // create a new category
  const handleAddCategory = async () => {
    try {
      const newCategory = {
        Name: categoryName,
        Description: categoryDescription,
        IsActivated: isActivated,
      };

      const response = await axios.post("/api/categories", newCategory, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.status === 200) {
        setMessage("Category added successfully!");
        resetForm();
      } else {
        setMessage("Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("Error occurred while adding category.");
    }
    toggleDrawer();
  };

  //reset form to initial state
  const resetForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setIsActivated(true);
  };

  const toggleDrawer = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
              <div style={{ marginLeft: "75px" }}>Add New Category</div>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="categoryName">
                  <Form.Label>Name</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="categoryDescription">
                  <Form.Label>Description</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Category Description"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="isActivated">
                  <Form.Label>Activate / Deactivate</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Select
                      value={isActivated}
                      onChange={(e) =>
                        setIsActivated(e.target.value === "true")
                      }
                    >
                      <option value={true}>Activate</option>
                      <option value={false}>Deactivate</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={handleAddCategory}
                  >
                    Submit
                  </Button>
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

export default AddCategory;
