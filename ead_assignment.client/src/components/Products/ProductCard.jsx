import React, { useContext, useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import UpdateProduct from "./UpdateProduct";

const ProductCard = ({ product, fetchProducts }) => {
  const { userData } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleShowSwal = () => {
    Swal.fire({
      title: product.name,
      html: `
        <img src="https://localhost:7261/${product.image}" alt="${product.name}" style="width: 100%; margin-bottom: 10px;" />
        <p>${product.categoryName}</p><p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p><p><strong>Quantity:</strong> $${product.quantity}</p>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
    });
  };

  const handleUpdateProduct = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Delete a product
  const handleDeleteProduct = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        await Swal.fire(
          "Deleted!",
          "Your product has been deleted.",
          "success"
        );
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the product.",
        "error"
      );
    }
  };

  const category = categories.find((cat) => cat.name === product.categoryName);

  const categoryBackgroundColor =
    category && !category.isActivated ? "bg-danger" : "bg-primary";

  return (
    <>
      <Card style={{ width: "100%", padding: "10px", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <div
            className="text-white rounded px-2"
            style={{
              position: "absolute",
              left: "0px",
              zIndex: 1,
              backgroundColor: "#d3d3d3",
            }}
          >
            <p style={{ margin: 0, color: "black" }}>{product.quantity} left</p>
          </div>
          <Card.Img
            variant="top"
            src={`https://localhost:7261/${product.image}`}
            alt={product.name}
            onClick={handleShowSwal}
            style={{ cursor: "pointer" }}
          />
          <div
            className={`${categoryBackgroundColor} text-white rounded px-2`}
            style={{
              position: "absolute",
              bottom: "8px",
              right: "0px",
              zIndex: 1,
            }}
          >
            <p style={{ margin: 0 }}>{product.categoryName}</p>
          </div>
        </div>

        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="description-text">
            {product.description.length > 100
              ? product.description.substring(0, 100) + "..."
              : product.description}
          </Card.Text>
          <Card.Text style={{ fontSize: "20px" }}>
            $ {parseFloat(product.price).toFixed(2)}
          </Card.Text>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Update
          </Button>{" "}
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Card.Body>
      </Card>

      <Drawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        direction="right"
        style={{ width: "400px", backgroundColor: "RGB(44, 103, 107)" }}
      >
        <UpdateProduct
          onClose={handleCloseDrawer}
          productData={product}
          categories
        />
      </Drawer>
    </>
  );
};

export default ProductCard;
