import React from 'react';
import { Container } from 'react-bootstrap';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

const App: React.FC = () => {
  return (
    <Container>
      <Home />
    </Container>
  );
};

export default App;