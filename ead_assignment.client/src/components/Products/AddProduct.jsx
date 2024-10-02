import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Image,
  InputGroup,
} from "react-bootstrap";
import { RiImageAddFill } from "react-icons/ri";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useProducts } from "../../context/ProductContext";

const AddProduct = ({ onClose }) => {
  const { createProduct, categories, fetchProducts } = useProducts();
  const [message, setMessage] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [warningLimit, setWarningLimit] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  // Function to reset form fields
  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setProductImage(null);
    setImagePreview(null);
  };

  // Reset the form when the drawer is closed
  useEffect(() => {
    if (!onClose) {
      resetForm();
    }
  }, [onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", productName);
    formData.append("Description", productDescription);
    formData.append("Price", productPrice);
    formData.append("CategoryId", productCategory);
    formData.append("Image", productImage);
    formData.append("Quantity", productQuantity);
    formData.append("WarningLimit", warningLimit);

    try {
      await createProduct(formData);
      setMessage("Product created successfully!");
      fetchProducts();
      resetForm();
      // onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage("Error creating product.");
    }
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
        onClick={onClose}
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
              <div style={{ marginLeft: "75px" }}>Add New Product</div>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Image Upload */}
                <Form.Group controlId="productImage" className="text-center">
                  <div
                    onClick={handleImageClick}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      width: "160px",
                      height: "160px",
                      border: "2px dashed #ddd",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      position: "relative",
                    }}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Product Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        rounded
                      />
                    ) : (
                      <RiImageAddFill
                        style={{ fontSize: "4rem", color: "#888" }}
                      />
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </Form.Group>

                {/* Product Name */}
                <Form.Group controlId="productName">
                  <Form.Label>Name</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Product Name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Product Description */}
                <Form.Group controlId="productDescription">
                  <Form.Label>Description</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Description"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="productQuantity">
                      <Form.Label>Quantity</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Enter quantity"
                          value={productQuantity}
                          onChange={(e) => setProductQuantity(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="warningLimit">
                      <Form.Label>Warning Limit</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Enter warning limit"
                          value={warningLimit}
                          onChange={(e) => setWarningLimit(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    {/* Product Price */}
                    <Form.Group controlId="productPrice">
                      <Form.Label>Price</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Enter Price"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {/* Product Category */}
                    <Form.Group controlId="productCategory">
                      <Form.Label>Category</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Select
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                        >
                          <option value="">Select</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="mt-4"
                    onClick={handleSubmit}
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
              <Toast style={{ color: "white", backgroundColor: "#212529" }}>
                <Toast.Body>{message}</Toast.Body>
              </Toast>
            )}
          </ToastContainer>
        </Col>
      </Row>
    </Col>
  );
};

export default AddProduct;
