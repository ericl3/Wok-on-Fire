import React, { Component } from 'react';

import { Container, Row, Col, Button, Table } from 'react-bootstrap'

import Navbar from '../components/Navbar/Navbar'

class Home extends Component {
    render() {
        const mystyle = {
            width: "75%",
            height: "75%"
          };
        return (
            <body style = {{fontFamily: 'Montserrat'}}>
                <Container fluid>
                    <Navbar></Navbar>
                    <br></br>
                    <Row>
                        <Col>
                            <center><img src={require("../images/logo.png")}/></center>
                            <br></br>
                            <center><img src={require("../images/homepage graphic.png")} style={mystyle}/></center>
                        </Col>
                    </Row>
                </Container>
            </body>
        )
    }
}

export default Home

