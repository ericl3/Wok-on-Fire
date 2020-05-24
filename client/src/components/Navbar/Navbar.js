import React, { Component } from 'react';

// Components
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';


class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
          cart: [],
          tabId: 0,
        }
    }
    render() {
        return(
            <Navbar expand="lg" style={{marginBottom:"-20px"}}>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#home" style ={{fontSize:"20px",color:"black",marginRight:"20px",marginLeft:"50px",marginTop:"20px"}}>Menu</Nav.Link>
                  <Nav.Link href="/order" style ={{fontSize:"20px",color:"black",marginRight:"20px",marginLeft:"20px",marginTop:"20px"}}>Order Online</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default NavBar;