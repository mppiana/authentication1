import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Dashboard from "./Dashboard";
import Login from "./login";

function App() {
  return (
    <Router>
      <Row>
        <Col md={12}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Col>
      </Row>
    </Router>
  );
}

export default App;
