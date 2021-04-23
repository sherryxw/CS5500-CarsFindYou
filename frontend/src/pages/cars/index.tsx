import React from "react";
import { Container, Row, Col } from "reactstrap";
import underConstruction from "src/pictures/under-construction.png";

const CarManagement = () => {
  return (
    <Container>
      <Row className='justify-content-center'>
        <Col sm='auto'>
          <h2>Offer Management</h2>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col sm='auto'>
          <img src={underConstruction} alt='coming soon' />
        </Col>
      </Row>
    </Container>
  );
};

export default CarManagement;
