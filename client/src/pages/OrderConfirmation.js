import React, { Component } from 'react'

import Lottie from 'react-lottie'
import loadingAnimationData from '../lotties/11346-red-loading.json'

import { Row, Col, Container, Button } from 'react-bootstrap'

class OrderConfirmation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true
        }
    }

    componentDidMount = async () => {
        setTimeout(async () => {
            this.setState({loading: false})
        }, 1500)
    }

    render() {

        const animationOptionsLoading = {
            loop: true,
            autoplay: true,
            animationData: loadingAnimationData,
            renderSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }

        let confirmation = this.state.loading ? 
            (<Row style={{marginTop: '5rem'}}>
                <Col className="text-center">
                    <img src={require("../images/logo.png")}/>
                    <Lottie options={animationOptionsLoading} width={100} height={100}/>
                    <p>Just a Moment, Please</p>
                </Col>
            </Row>) :
            (
                <div>
                    <Row Row style={{marginTop: '5rem'}}>
                        <Col className="text-center">
                            <img src={require("../images/logo.png")}/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col className="text-center">
                            <p>Thank you for placing your order!</p>
                            <p>Please check your email for an order confirmation (and text message if applicable)</p>
                            <Button onClick={() => window.location.href = "/"}>Home</Button>
                        </Col>
                    </Row>
                </div>
            )

     return(
        <Container fluid>
            {confirmation}
         </Container>
        
     )
    }
}

export default OrderConfirmation