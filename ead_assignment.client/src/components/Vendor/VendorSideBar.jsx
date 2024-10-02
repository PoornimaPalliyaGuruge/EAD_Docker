import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";

const VendorSideBar = ({ setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState("MyProducts");

  const handleItemClick = (component) => {
    setActiveComponent(component);
    setActiveItem(component);
  };

  const itemStyle = {
    backgroundColor: "RGB(34, 83, 87)",
    color: "white",
    border: "none",
    height: "60px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "18px",
  };

  const hoverStyle = {
    backgroundColor: "RGB(44, 103, 107)",
  };

  const SideBarItem = ({ icon, label, component }) => (
    <ListGroup.Item
      action
      onClick={() => handleItemClick(component)}
      style={{
        ...itemStyle,
        ...(activeItem === component ? hoverStyle : {}),
      }}
      onMouseEnter={(e) =>
        (e.target.style.backgroundColor = "RGB(44, 103, 107)")
      }
      onMouseLeave={(e) => {
        if (activeItem !== component) {
          e.target.style.backgroundColor = "RGB(34, 83, 87)";
        }
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <div>{icon}</div>
        <div>{label}</div>
      </div>
    </ListGroup.Item>
  );

  return (
    <ListGroup
      style={{
        height: "100vh",
        borderRadius: "0",
        padding: 0,
      }}
    >
      <SideBarItem
        icon={<FaUsers size={25} />}
        label="My Products"
        component="MyProducts"
      />
    </ListGroup>
  );
};

export default VendorSideBar;
