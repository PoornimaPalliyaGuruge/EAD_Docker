import React, { useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import VendorSideBar from "./Vendor/VendorSideBar";
import MyProducts from "./Vendor/MyProducts";

const VendorPanel = () => {
  const [activeComponent, setActiveComponent] = useState("MyProducts");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case "MyProducts":
        return <MyProducts />;
      default:
        return <MyProducts />;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <Button
        className="d-md-none"
        onClick={toggleSidebar}
        variant="dark"
        style={{ marginBottom: "15px" }}
      >
        {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      </Button>

      <Row className="landing">
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
          <VendorSideBar setActiveComponent={setActiveComponent} />
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

export default VendorPanel;
