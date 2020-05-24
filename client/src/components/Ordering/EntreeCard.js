import React, { Component } from 'react';

import {Card, Row, Col, Button} from 'react-bootstrap'

import NumericInput from 'react-numeric-input'

class EntreeCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
        }
    }

    render() {
        return (
            <Card body className="shadow-sm" style={{marginTop: '0.5rem', marginBottom: '0.5rem'}}>
                <Row> 
                    <Col md={5}>
                        <Row>
                            <Col>
                                <p>{this.props.name}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p> {this.props.desc}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <p>Quantity:</p>
                        <NumericInput
                            style={{input:{pointerEvents: 'none'}}}
                            min={1}
                            value={this.state.quantity}
                            onChange={(valueAsNumber) => this.setState({quantity: valueAsNumber})}
                        />
                    </Col>
                    <Col>
                        <p>Price: ${this.props.price}</p>
                        <Button style={{marginTop: 'auto', marginBottom: 'auto'}} onClick={() => this.props.addToOrder(this.props.name, this.props.desc, this.props.price, this.state.quantity, this.props.type)}>Add to Order</Button>
                    </Col>
                </Row>

            </Card>
        )
    }
}

export default EntreeCard