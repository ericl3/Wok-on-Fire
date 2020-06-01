import React, { Component } from 'react';
import Navbar from '../components/Navbar/Navbar'

import { Container } from 'react-bootstrap'

class Menu extends Component {
    render() {
        return(
            <Container fluid style={{fontFamily: 'montserrat'}}>
                <Navbar/>
                <center>
                <img src = {require("../images/menu.png")} style={{width: '75vh', height: '100 vh', marginTop: '2rem'}}/>

                </center>

            </Container>
        )
    }
}

export default Menu