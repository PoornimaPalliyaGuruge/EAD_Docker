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
import { MdModeEditOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useProducts } from "../../context/ProductContext";

const UpdateProduct = ({ onClose, productData }) => {
  const { updateProduct, categories } = useProducts();
  const [message, setMessage] = useState("");
  const [productName, setProductName] = useState(productData.name || "");
  const [productDescription, setProductDescription] = useState(
    productData.description || ""
  );
  const [productQuantity, setProductQuantity] = useState(
    productData.quantity || ""
  );
  const [warningLimit, setWarningLimit] = useState(
    productData.warningLimit || ""
  );
  const [productPrice, setProductPrice] = useState(productData.price || "");
  const [productCategory, setProductCategory] = useState(
    productData.categoryId || ""
  );
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    `https://localhost:7261/${productData.image}` || null
  );
  const [isEditing, setIsEditing] = useState({
    productName: false,
    productDescription: false,
    productPrice: false,
    productCategory: false,
    productQuantity: false,
    warningLimit: false,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Upload image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setProductImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleEditToggle = async (field) => {
    if (isEditing[field]) {
      await handleSubmit();
    }
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Update product details
  const handleSubmit = async () => {
    const updateData = {
      Name: productName,
      Description: productDescription,
      Price: productPrice,
      CategoryId: productCategory,
      Quantity: productQuantity,
      WarningLimit: warningLimit,
    };

    try {
      await updateProduct(productData.id, updateData);
      setMessage("Product updated successfully!");
      // onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Error updating product.");
    }
  };

  const resetForm = () => {
    setProductName(productData.name || "");
    setProductDescription(productData.description || "");
    setProductPrice(productData.price || "");
    setProductCategory(productData.categoryId || "");
    setProductImage(`https://localhost:7261/${productData.image}` || "");
    setImagePreview(`https://localhost:7261/${productData.image}` || null);
    setIsEditing(false);
  };

  const toggleDrawer = () => {
    resetForm();
    onClose();
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
              <div style={{ marginLeft: "90px" }}>Update Product</div>
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
                      <div
                        style={{
                          position: "relative",
                          width: "160px",
                          height: "160px",
                        }}
                      >
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
                        <MdModeEditOutline
                          style={{
                            position: "absolute",
                            bottom: "3px",
                            right: "1px",
                            fontSize: "24px",
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: "5px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
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
                      readOnly={!isEditing.productName}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("productName")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.productName ? (
                        <FaCheck />
                      ) : (
                        <MdModeEditOutline />
                      )}
                    </InputGroup.Text>
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
                      readOnly={!isEditing.productDescription}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      onClick={() => handleEditToggle("productDescription")}
                      style={{ cursor: "pointer" }}
                    >
                      {isEditing.productDescription ? (
                        <FaCheck />
                      ) : (
                        <MdModeEditOutline />
                      )}
                    </InputGroup.Text>
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
                          readOnly={!isEditing.productQuantity}
                        />
                        <InputGroup.Text
                          id="basic-addon1"
                          onClick={() => handleEditToggle("productQuantity")}
                          style={{ cursor: "pointer" }}
                        >
                          {isEditing.productQuantity ? (
                            <FaCheck />
                          ) : (
                            <MdModeEditOutline />
                          )}
                        </InputGroup.Text>
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
                          readOnly={!isEditing.warningLimit}
                        />
                        <InputGroup.Text
                          id="basic-addon1"
                          onClick={() => handleEditToggle("warningLimit")}
                          style={{ cursor: "pointer" }}
                        >
                          {isEditing.warningLimit ? (
                            <FaCheck />
                          ) : (
                            <MdModeEditOutline />
                          )}
                        </InputGroup.Text>
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
                          readOnly={!isEditing.productPrice}
                        />
                        <InputGroup.Text
                          id="basic-addon1"
                          onClick={() => handleEditToggle("productPrice")}
                          style={{ cursor: "pointer" }}
                        >
                          {isEditing.productPrice ? (
                            <FaCheck />
                          ) : (
                            <MdModeEditOutline />
                          )}
                        </InputGroup.Text>
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

export default UpdateProduct;
