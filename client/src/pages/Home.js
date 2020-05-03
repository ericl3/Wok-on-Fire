import React, { Component } from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap'

class Home extends Component {
    render() {
        const mystyle = {
            width: "50%",
            height: "50%"
          };
        return (
            <Container>
                <Row>
                    <Col>
                        <center><img src={require("../images/logo.png")}/></center>
                        <br></br>
                        <center><img src={require("../images/homepage graphic.png")} style={mystyle}/></center>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Home

