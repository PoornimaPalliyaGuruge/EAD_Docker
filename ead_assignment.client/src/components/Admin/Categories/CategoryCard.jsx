import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaCircle } from "react-icons/fa";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Drawer from "react-modern-drawer";
import UpdateCategory from "./UpdateCategory";
import Swal from "sweetalert2";

const CategoryCard = ({ category, onToggleActivation, onCategoryDeleted }) => {
  const { userData } = useContext(UserContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const categoryBackgroundColor = !category.isActivated
    ? "text-danger"
    : "text-primary";
  const categoryButtonColor = !category.isActivated
    ? "bg-primary"
    : "bg-danger";
  const cardBorder = !category.isActivated ? "danger" : "primary";

  const handleIsActivated = async () => {
    try {
      const response = await axios.put(
        `/api/categories/toggle-activation/${category.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        onToggleActivation();
      }
    } catch (error) {
      console.error("Error toggling category activation:", error);
    }
  };

  const handleCategoryDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `/api/categories/${category.id}`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );

          if (response.status === 200) {
            Swal.fire("Deleted!", "The category has been deleted.", "success");
            onCategoryDeleted();
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the category.",
            "error"
          );
        }
      }
    });
  };

  const handleShowSwal = () => {
    Swal.fire({
      title: category.name,
      html: `<p>${category.description}</p><p><strong>${
        category.isActivated ? "Activated" : "Deactivated"
      }</strong></p>`,
    });
  };

  return (
    <>
      <Card border={`${cardBorder}`} style={{ borderWidth: "0.1rem" }}>
        <Card.Header
          as="h5"
          onClick={handleShowSwal}
          style={{ cursor: "pointer" }}
        >
          {category.name}{" "}
          <FaCircle
            className={categoryBackgroundColor}
            style={{
              position: "absolute",
              top: "10px",
              right: "4px",
              zIndex: 1,
            }}
          />
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {category.description.length > 100
              ? category.description.substring(0, 45) + "..."
              : category.description}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Button
              className={`${categoryButtonColor} border-0`}
              onClick={handleIsActivated}
            >
              {category.isActivated ? "Deactivate" : "Activate"}
            </Button>
            <div>
              <Button
                className="rounded-circle p-2 d-flex justify-content-center align-items-center"
                style={{
                  marginBottom: "5px",
                  backgroundColor: "#2C676B",
                }}
                onClick={toggleDrawer}
              >
                <MdModeEditOutline />
              </Button>
              <Button
                className="rounded-circle p-2 d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: "#2C676B",
                }}
                onClick={handleCategoryDelete}
              >
                <RiDeleteBin5Fill />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction="right"
        style={{
          width: "400px",
          backgroundColor: "RGB(34, 83, 87)",
        }}
      >
        <UpdateCategory
          categoryData={category}
          onClose={toggleDrawer}
          onUpdate={onCategoryDeleted}
        />
      </Drawer>
    </>
  );
};

export default CategoryCard;
