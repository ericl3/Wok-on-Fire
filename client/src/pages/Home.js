import React, { Component } from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap'

class Home extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <center><img src="../../images/logo.png"/></center>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Home

