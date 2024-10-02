import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { RiAddBoxFill } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";
import CategoryCard from "./Categories/CategoryCard";
import Drawer from "react-modern-drawer";
import AddCategory from "./Categories/AddCategory";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("");
  const [deactive, setDeactive] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
    fetchCategories();
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("api/categories/", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleActivation = () => {
    fetchCategories();
  };

  return (
    <>
      <Container>
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
              <FaCircle className="text-primary" /> Activate{" "}
            </div>
            <div>
              <FaCircle className="text-danger" /> Deactivate
            </div>
          </div>

          <div>
            <RiAddBoxFill
              size={40}
              style={{
                cursor: "pointer",
              }}
              onClick={toggleDrawer}
            />
          </div>
        </div>
        <Row>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Col
                key={category.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4"
              >
                <CategoryCard
                  category={category}
                  onToggleActivation={handleToggleActivation}
                  onCategoryDeleted={fetchCategories}
                />
              </Col>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </Row>
      </Container>
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction="right"
        style={{
          width: "400px",
          backgroundColor: "RGB(34, 83, 87)",
        }}
      >
        <AddCategory onClose={toggleDrawer} />
      </Drawer>
    </>
  );
};

export default Categories;
