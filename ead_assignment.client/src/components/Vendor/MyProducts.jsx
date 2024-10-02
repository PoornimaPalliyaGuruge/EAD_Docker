import React, { useState, useEffect } from "react";
import { RiAddBoxFill } from "react-icons/ri";
import ProductCard from "../Products/ProductCard";
import { Col, Row, Container, DropdownButton, Dropdown } from "react-bootstrap";
import { useProducts } from "../../context/ProductContext";
import Drawer from "react-modern-drawer";
import AddProduct from "../Products/addProduct";
import { FaCircle } from "react-icons/fa";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const MyProducts = () => {
  const { products, categories, fetchProducts, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  // Filter products by category
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.categoryId === categoryId
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);

  return (
    <>
      <Container>
        {/* Category and Add Product Button */}
        <div
          className="icon-container justify-content-between"
          style={{
            color: "RGB(34, 83, 87)",
            textAlign: "right",
            marginBottom: "20px",
          }}
        >
          <div
            className="d-flex justify-content-start align-items-center"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            <div className="me-3">
              <FaCircle className="text-primary mb-1" /> Activate{" "}
            </div>
            <div>
              <FaCircle className="text-danger mb-1" /> Deactivate
            </div>
          </div>

          <div className="d-flex justify-content-start align-items-center">
            <div>
              <DropdownButton
                id="dropdown-basic-button"
                title="Filter Category"
                variant="secondary"
                onSelect={handleCategorySelect}
              >
                <Dropdown.Item eventKey="">All</Dropdown.Item>
                {categories.map((category) => (
                  <Dropdown.Item key={category.id} eventKey={category.id}>
                    {category.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            <div>
              <RiAddBoxFill
                size={42}
                style={{ cursor: "pointer" }}
                onClick={toggleDrawer}
              />
            </div>
          </div>
        </div>

        {/* Product List */}
        <Row>
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col
                key={product.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4"
              >
                <ProductCard product={product} fetchProducts={fetchProducts} />
              </Col>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </Row>
      </Container>

      {/* Add Product Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction="right"
        style={{ width: "400px", backgroundColor: "RGB(34, 83, 87)" }}
      >
        <AddProduct onClose={() => setIsDrawerOpen(false)} />
      </Drawer>
    </>
  );
};

export default MyProducts;
