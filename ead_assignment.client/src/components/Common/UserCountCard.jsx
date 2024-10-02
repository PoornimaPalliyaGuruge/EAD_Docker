import React from "react";
import { Card } from "react-bootstrap";

const UserCountCard = ({ icon, title, count }) => {
  return (
    <Card style={{ width: "12rem", textAlign: "center", height: "8rem" }}>
      <Card.Body>
        <Card.Title style={{ fontSize: "23px" }}>{icon}</Card.Title>
        <Card.Text>
          <strong>{title}</strong>
        </Card.Text>
        <Card.Text>{count}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UserCountCard;
