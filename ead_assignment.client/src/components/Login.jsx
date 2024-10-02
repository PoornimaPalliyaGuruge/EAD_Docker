import React from "react";
import LoginForm from "./Login/LoginForm";
import RightSide from "./Login/RightSide";
import { Col, Row } from "react-bootstrap";

const Login = () => {
  return (
    <Row className="landing">
      <Col>
        <LoginForm />
      </Col>
      <Col>
        <RightSide />
      </Col>
    </Row>
  );
};

export default Login;
