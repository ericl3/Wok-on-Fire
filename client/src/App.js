import React from 'react';
import logo from './logo.svg';
import './App.css';

// Pages
import Home from '../src/pages/Home';

// Tools
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

function App() {
  return (
    <div>
      <Navbar>
  <Navbar.Brand href="#home">Menu</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse className="justify-content-end">
  </Navbar.Collapse>
</Navbar>
    <Router>
      <Switch>
        <Route exact path = "/" component = { Home } />
      </Switch>
    </Router>
    </div>
  );
}

export default App;
