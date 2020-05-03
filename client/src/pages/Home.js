import React, { Component } from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap'

class Home extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div>
                            <p>Wok on Fire</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Home