import React, { Component } from 'react';

import { Container, Row, Col, Button, Table } from 'react-bootstrap'

class Home extends Component {
    render() {
        const mystyle = {
            width: "50%",
            height: "50%"
          };
        const containerStyle = {
            border: "solid 4px #A61800",
            height: "99vh"
        }
        return (
            <body>
                <Container fluid style={containerStyle}>
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

