import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { MdCardMembership } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";

const SideBar = ({ setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState("AssignUsers");

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
    <ListGroup style={{ height: "100vh", padding: 0 }}>
      <SideBarItem
        icon={<FaUsers size={25} />}
        label="Users"
        component="AssignUsers"
      />
      <SideBarItem
        icon={<FaBoxArchive size={25} />}
        label="Categories"
        component="Categories"
      />
      <SideBarItem
        icon={<MdCardMembership size={25} />}
        label="Requests"
        component="Requests"
      />
      <SideBarItem
        icon={<FaClipboardList size={25} />}
        label="Orders"
        component="Orders"
      />
    </ListGroup>
  );
};

export default SideBar;
