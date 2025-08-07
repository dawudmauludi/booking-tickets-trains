import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Topbar: React.FC = () => {
  return (
    <Navbar bg="light" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand>Admin Dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Topbar;
