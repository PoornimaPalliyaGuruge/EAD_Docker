import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Badge,
  Accordion,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const Orders = () => {
  // Dummy data for orders with multiple products
  const orders = [
    {
      id: "ORD001",
      customerName: "John Doe",
      products: [
        { name: "Product 1", quantity: 2, price: 30.0 },
        { name: "Product 2", quantity: 1, price: 60.5 },
      ],
      status: "Pending",
      date: "2024-09-29",
    },
    {
      id: "ORD002",
      customerName: "Jane Smith",
      products: [{ name: "Product 3", quantity: 5, price: 50.0 }],
      status: "Shipped",
      date: "2024-09-28",
    },
    {
      id: "ORD003",
      customerName: "Peter Parker",
      products: [{ name: "Product 4", quantity: 1, price: 99.99 }],
      status: "Delivered",
      date: "2024-09-27",
    },
    {
      id: "ORD004",
      customerName: "Bruce Wayne",
      products: [
        { name: "Product 5", quantity: 3, price: 150.25 },
        { name: "Product 6", quantity: 2, price: 100.25 },
      ],
      status: "Cancelled",
      date: "2024-09-26",
    },
  ];

  // Function to calculate total price of an order
  const calculateTotal = (products) => {
    return products
      .reduce((total, product) => total + product.price * product.quantity, 0)
      .toFixed(2);
  };

  // Function to dynamically style the status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Shipped":
        return <Badge bg="primary">Shipped</Badge>;
      case "Delivered":
        return <Badge bg="success">Delivered</Badge>;
      case "Cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="mt-5">
      <h2>Admin Panel: Orders</h2>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <React.Fragment key={order.id}>
              <tr>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{order.date}</td>
                <td>${calculateTotal(order.products)}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    View
                  </Button>
                  <Button variant="danger" size="sm">
                    Cancel
                  </Button>
                </td>
              </tr>
              {/* Products Row */}
              <tr>
                <td colSpan="6">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header>View Products</Accordion.Header>
                      <Accordion.Body>
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Product Name</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((product, idx) => (
                              <tr key={idx}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>${product.price.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;
