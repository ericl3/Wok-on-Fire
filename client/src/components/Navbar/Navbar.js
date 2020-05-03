import React, { Component } from 'react';

// Components
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';


class NavBar extends Component {
    render() {
        return(
<Navbar>
  <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse className="justify-content-end">
  </Navbar.Collapse>
</Navbar>
        )
    }
}

export default NavBar;