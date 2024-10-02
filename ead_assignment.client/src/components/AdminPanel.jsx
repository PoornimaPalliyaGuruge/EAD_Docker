import React, { useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import SideBar from "./Admin/SideBar";
import AssignUsers from "./Admin/AssignUsers";
import Categories from "./Admin/Categories";
import Requests from "./Admin/Requests";
import Orders from "./Admin/Orders";

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState("AssignUsers");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case "AssignUsers":
        return <AssignUsers />;
      case "Categories":
        return <Categories />;
      case "Requests":
        return <Requests />;
      case "Orders":
        return <Orders />;
      default:
        return <AssignUsers />;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <Button className="d-md-none mb-3" onClick={toggleSidebar} variant="dark">
        {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      </Button>

      <Row className="landing">
        {/* Sidebar */}
        <Col
          md={2}
          className={`d-md-block ${sidebarOpen ? "d-block" : "d-none"}`}
          style={{
            backgroundColor: "#23474a",
            padding: 0,
            transition: "all 0.3s ease",
            position: "sticky",
            top: "0",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <SideBar setActiveComponent={setActiveComponent} />
        </Col>

        {/* Main content */}
        <Col
          md={10}
          className="d-flex justify-content-center px-3"
          style={{ minHeight: "80vh" }}
        >
          <div style={{ width: "100%" }}>{renderComponent()}</div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPanel;
