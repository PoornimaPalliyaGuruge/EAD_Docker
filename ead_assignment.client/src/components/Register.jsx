import React from "react";
import RegisterForm from "./Login/RegisterForm";
import RightSide from "./Login/RightSide";
import { Col, Row } from "react-bootstrap";

const Register = () => {
  return (
    <Row className="landing">
      <Col>
        <RegisterForm />
      </Col>
      <Col>
        <RightSide />
      </Col>
    </Row>
  );
};

export default Register;
