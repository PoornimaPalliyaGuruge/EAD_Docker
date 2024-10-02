import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const { userData } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all products for the current vendor
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products/vendor", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Fetch all product categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Create a new product
  const createProduct = async (formData) => {
    try {
      const response = await axios.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userData.token}`,
        },
      });
      setProducts((prev) => [...prev, response.data.product]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Update an existing product
  const updateProduct = async (productId, updatedData) => {
    try {
      const response = await axios.put(
        `/api/products/update/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? response.data.product : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const value = {
    products,
    categories,
    loading,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  useEffect(() => {
    if (userData?.token) {
      fetchProducts();
      fetchCategories();
    }
  }, [userData]);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

const useProducts = () => {
  return useContext(ProductContext);
};

export { ProductProvider, useProducts };
