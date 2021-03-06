import React, { Component } from 'react';

import {Tab, Tabs, Container, Row, Col, Card, Form, Button, Modal} from 'react-bootstrap';

import isEmpty from '../validation/isEmpty'
import Lottie from 'react-lottie';
import loadingAnimationData from '../lotties/11346-red-loading.json'

import EntreeCard from '../components/Ordering/EntreeCard'

import NumericInput from 'react-numeric-input'

import classnames from 'classnames'

import validateOrderInput from '../validation/validateOrderInput'

import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Order extends Component {
    constructor(props) {
        super(props);

        this.state = {
            available: '',
            grillOrders: [], 
            kitchenOrders: [],
            stage: 0,
            baseProtein: 'Beef',
            proteinExtraPrice: 0.0,
            additionalIngredients: ["Noodles", "Broccoli", "Onion", "Green Onion", "Carrot", "Mushroom"],
            sauces: [],
            toGoSauces: [],
            additionalInstructionsGrill: '',  
            additionalInstructionsOrder: '', 
            lunch: '',
            subtotal: 0.00,
            deal: 0.00,
            tax: 0.00,
            total: 0.00,
            name: '',
            email: '',
            phone: '',
            location: 'Silverdale',
            showModal: false,
            receiveText: false,
            restaurantAvailable: true,
            errors: {},
        }
    }

    componentDidMount = async () => {
        setTimeout(async() => {
            var pstDate = this.getTimePST()
            var hour = pstDate.getHours()
        
            // Sundays 12AM - 7PM, all others 12AM - 8PM
            // Acual Time Gating Code
            if (pstDate.getDay() === 0) {
                if (hour < 12 || hour >= 19) {
                    this.setState({
                        available: false,
                    }, () => this.setMealTime())
                } else {
                    this.setState({
                        available: true,
                    }, () => this.setMealTime())
                }
            } else {
                if (hour < 12 || hour >= 20) {
                    this.setState({
                        available: false
                    }, () => this.setMealTime())
                } else {
                    this.setState({
                        available: true
                    }, () => this.setMealTime())
                }
            }

            // Testing when it's not open (manual test)

            // this.setState({
            //     available: true
            // })
            
            // Close the online order form, no matter the time. 

            // this.setState({
            //     available: false,
            //     restaurantAvailable: false
            // })
            
        }, 1500)
        
    }

    getTimePST = () => {
        // Convert Time
        var date = new Date();
        var localTime = date.getTime();
        var localOffset = date.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset
        var pstOffset = -7.0
        var pst = utc + 3600000 * pstOffset
        console.log(date)

        // Get new Time Formmated
        var pstDate = new Date(pst);
        return pstDate;
    }

    setMealTime = () => {
        if (this.getTimePST().getHours() < 16) {
            this.setState({
                lunch: true
            })
        } else {
            this.setState({
                lunch: false
            })
        }
    }

    changeTextNotif = () => {
        this.setState({
            receiveText: !this.state.receiveText
        })
    }

    handleGrillProteinChange = e => {
        if (e.target.value === 'Shrimp ($2 Extra)') {
            this.setState({
                baseProtein: e.target.value,
                proteinExtraPrice: 2.0
            })
        } else {
            this.setState({
                baseProtein: e.target.value,
                proteinExtraPrice: 0.0
            })

        }
    }

    handleIngredientChange = e => {
        const index = this.state.additionalIngredients.indexOf(e.target.value)
        if (index > -1) {
            this.setState({
                additionalIngredients: this.state.additionalIngredients.filter((ingredient) => ingredient !== e.target.value)
            })
        } else {
            this.setState({
                additionalIngredients: [...this.state.additionalIngredients, e.target.value]
            })
        }
    }

    handleSauceChange = e => {
        const index = this.state.sauces.indexOf(e.target.value)
        if (index > -1) {
            this.setState({
                sauces: this.state.sauces.filter((sauce) => sauce !== e.target.value)
            })
        } else {
            this.setState({
                sauces: [...this.state.sauces, e.target.value]
            })
        }
    }

    handleToGoSauceChange = e=> {
        const index = this.state.toGoSauces.indexOf(e.target.value)
        if (index > -1) {
            this.setState({
                toGoSauces: this.state.toGoSauces.filter((sauce) => sauce !== e.target.value)
            })
        } else {
            this.setState({
                toGoSauces: [...this.state.toGoSauces, e.target.value]
            })
        }
    }

    handleChange= e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChangeLocation = e => {
        this.setState({
            location: e.target.value
        }, () => this.calculatePrices())
    }

    decrementStage = () => {
        this.setState({
            stage: this.state.stage - 1
        }, () => {
            document.getElementById('order-form').scrollIntoView({behavior: "smooth"})
        })
    }

    advanceStage = () => {
        console.log(this.state)
        this.setState({
            stage: this.state.stage + 1
        }, () => {
            if (this.state.stage === 4) {
                document.getElementById('cart').scrollIntoView({behavior: "smooth"})
            } else {
                document.getElementById('order-form').scrollIntoView({behavior: "smooth"})
            }
        })
    }

    notifyAdd = () => toast.info("🥡 Added to Order!")

    notifyUpdate = () => toast.info("🛒 Item Updated in Cart!")

    addToOrderGrill = () => {
        const grillOrder = {
            id: Math.random().toString(36).substr(2, 7),
            baseProtein: this.state.baseProtein,
            proteinExtraPrice: this.state.proteinExtraPrice,
            additionalIngredients: this.state.additionalIngredients,
            sauces: this.state.sauces,
            toGoSauces: this.state.toGoSauces,
            additionalInstructionsGrill: isEmpty(this.state.additionalInstructionsGrill) ? "None" : this.state.additionalInstructionsGrill
        }
        this.notifyAdd()
        this.setState({
            grillOrders: [grillOrder, ...this.state.grillOrders],
            baseProtein: 'Beef',
            proteinExtraPrice: 0.0,
            additionalIngredients: ["Noodles", "Broccoli", "Onion", "Green Onion", "Carrot", "Mushroom"],
            sauces: [],
            toGoSauces: [],
            additionalInstructionsGrill: '',  
        }, () => this.calculatePrices())
        this.advanceStage()
    }

    addToOrderKitchen = (name, desc, price, quantity, type) => {
        for (var i = 0; i < this.state.kitchenOrders.length; i++) {
            if (this.state.kitchenOrders[i].name === name) {
                this.updateQuantity(i, this.state.kitchenOrders[i].quantity + 1)
                document.getElementById('cart').scrollIntoView({behavior: "smooth"})
                return
            }
        }
        const kitchenOrder = {
            id: Math.random().toString(36).substr(2, 7),
            name: name,
            desc: desc,
            price: price,
            quantity: quantity,
            type: type
        }
        this.notifyAdd()
        if (type === "drink") {
            this.setState({
                kitchenOrders: [...this.state.kitchenOrders, kitchenOrder]
            }, () => {document.getElementById('cart').scrollIntoView({behavior: "smooth"}); this.calculatePrices()})
        } else {
            this.setState({
                kitchenOrders: [kitchenOrder, ...this.state.kitchenOrders]
            }, () => {document.getElementById('cart').scrollIntoView({behavior: "smooth"}); this.calculatePrices()})
        }
    }

    getGrillPriceForCart = (index) => {
        if (this.state.lunch) {
            return "$" + (10.99 + this.state.grillOrders[index].proteinExtraPrice) + " (Lunch)"
        } else {
            return "$" + (13.99 + this.state.grillOrders[index].proteinExtraPrice) + " (Dinner)"
        }
    }

    getGrillPriceForCalcs = (index) => {
        if (this.state.lunch) {
            return 10.99 + this.state.grillOrders[index].proteinExtraPrice
        } else {
            return 13.99 + this.state.grillOrders[index].proteinExtraPrice
        }
    }

    notifyRemove = () => toast.error("🥺 Removed from Order")

    removeFromOrders = (id) => {
        this.notifyRemove()
        this.setState({
            grillOrders: this.state.grillOrders.filter((grillOrder) => grillOrder.id !== id)
        }, () => {
            this.calculatePrices()
            document.getElementById('cart').scrollIntoView({behavior: "smooth"})
        })
    }

    removeFromOrdersKitchen = (id) => {
        this.notifyRemove()
        this.setState({
            kitchenOrders: this.state.kitchenOrders.filter((kitchenOrder) => kitchenOrder.id !== id)
        }, () => {
            this.calculatePrices()
            document.getElementById('cart').scrollIntoView({behavior: "smooth"})
        })

    }

    updateQuantity = (index, val) => {
        this.state.kitchenOrders[index].quantity = val;
        this.forceUpdate();
        this.calculatePrices();
        this.notifyUpdate()
        this.forceUpdate()
    }
    
    reset = () => {
        window.scrollTo(0, 0);
        this.setState({
            stage: 0
        })
    }

    calculatePrices = () => {
        var subtotal = 0.0
        var tax = 0.0
        var deal = 0.0
        var total = 0.0
        var prices = [];

        for (var i = 0; i < this.state.grillOrders.length; i++) {
            subtotal += this.getGrillPriceForCalcs(i)
        }

        for (var i = 0; i < this.state.kitchenOrders.length; i++) {
            subtotal += this.state.kitchenOrders[i].price * this.state.kitchenOrders[i].quantity
        }

        var kitchenQuantitiesEntree = 0;

        for (var i = 0; i < this.state.kitchenOrders.length; i++) {
            if(this.state.kitchenOrders[i].type === "entree") {
                kitchenQuantitiesEntree += this.state.kitchenOrders[i].quantity
            }
        }

        if (this.state.grillOrders.length + kitchenQuantitiesEntree > 1) {
            for (var i = 0; i < this.state.kitchenOrders.length; i++) {
                if(this.state.kitchenOrders[i].type === "entree") {
                    prices = [...prices, this.state.kitchenOrders[i].price]
                }
            }

            for (var i = 0; i < this.state.grillOrders.length; i++) {
                prices = [...prices, this.getGrillPriceForCalcs(i)]
            }


            deal = Math.min(...prices)/2
        }
        if (this.state.location === "Gig Harbor") {
            // tax = (subtotal - deal) * 0.087
            tax = subtotal * 0.087
        } else {
            // tax = (subtotal - deal) * 0.09
            tax = subtotal * 0.09
        }
        // total = (subtotal - deal) + tax
        total = subtotal + tax
        
        this.setState({
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            deal: deal.toFixed(2),
            total: total.toFixed(2)
        })
    }

    resetModal = () => {

    }

    validateInput = async () => {
        var payload = {
            email: this.state.email,
            name: this.state.name,
            phone: this.state.phone,
          }

        const { errors, isValid } = validateOrderInput(payload);

        if (!isValid) {
            this.setState({
                errors: errors
            });
            return;
        }

        this.setState({
        errors: {}
        })

        try {
            await axios.post('/order/create/wok-on-fire', {
                name: this.state.name,
                phone: this.state.phone,
                email: this.state.email,
                location: this.state.location,
                grillOrders: this.state.grillOrders,
                kitchenOrders: this.state.kitchenOrders,
                additionalInstructionsOrder: this.state.additionalInstructionsOrder,
                subtotal: this.state.subtotal,
                deal: this.state.deal,
                tax: this.state.tax,
                total: this.state.total,
                receiveText: this.state.receiveText,
                lunch: this.state.lunch
            })
            window.location.href = '/order-confirmation';
        } catch (err) {
            console.log(err)
        }
    }

    render(){

        const animationOptionsLoading = {
            loop: true,
            autoplay: true,
            animationData: loadingAnimationData,
            renderSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }

        /////////////////// GRILL ORDER FORM //////////////////////
        let grillOrderForm;

        if (this.state.stage === 0) {
            grillOrderForm = 
                (
                    <Row>
                        <Col>
                            <Form>
                                <Form.Group>
                                    <Form.Label><p>Step 1: Choose Your Protein</p></Form.Label>
                                    <Form.Control 
                                        as="select"
                                        onChange={(e) => this.handleGrillProteinChange(e)}
                                    >
                                        <option value = "Beef">Beef</option>
                                        <option value = "Chicken">Chicken</option>
                                        <option value = "Pork">Pork</option>
                                        <option value = "Tofu">Tofu</option>
                                        <option value = "Shrimp ($2 Extra)">Shrimp ($2 Extra)</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                            <Button onClick={() => this.advanceStage()}>
                                Next
                            </Button>
                        </Col>
                    </Row>
                )
        } else if (this.state.stage === 1) {
            grillOrderForm = 
                (
                    <div>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Group>
                                        <Form.Label><p>Step 2: Edit Base Ingredients </p></Form.Label>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Noodles")} label="Noodles" value="Noodles" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Broccoli")} label="Broccoli" value="Broccoli" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Onion")} label="Onion" value="Onion" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Green Onion")} label="Green Onion" value="Green Onion" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Carrot")} label="Carrot" value="Carrot" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Mushroom")} label="Mushroom" value="Mushroom" onChange={(e) => this.handleIngredientChange(e)}/>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Group>
                                        <Form.Label><p>Step 3: Select Additional Ingredients (No Extra Cost)</p></Form.Label>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Tofu")} label="Tofu" value="Tofu" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Pineapple")} label="Pineapple" value="Pineapple" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Cilantro")} label="Cilantro" value="Cilantro" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Celery")} label="Celery" value="Celery" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Green Pepper")} label="Green Pepper" value="Green Pepper" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Bell Pepper")} label="Bell Pepper" value="Bell Pepper" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Bean Sprout")} label="Bean Sprout" value="Bean Sprout" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Cabbage")} label="Cabbage" value="Cabbage" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Zucchini")} label="Zucchini" value="Zucchini" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Water Chestnut")} label="Water Chestnut" value="Water Chestnut" onChange={(e) => this.handleIngredientChange(e)}/>
                                        <Form.Check defaultChecked = {this.state.additionalIngredients.includes("Bamboo Shoot")} label="Bamboo Shoot" value="Bamboo Shoot" onChange={(e) => this.handleIngredientChange(e)}/>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Button onClick={() => this.decrementStage()} style={{marginRight: '0.5rem'}}>
                                        Back
                                </Button>
                                <Button onClick={() => this.advanceStage()}>
                                        Next
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )
        } else if (this.state.stage === 2){
            grillOrderForm = 
                (
                    <div>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Label><p>Step 4: Choose Sauces</p></Form.Label>
                                    <Form.Check defaultChecked = {this.state.sauces.includes("Mongolian Sauce")} label="Mongolian Sauce" value="Mongolian Sauce" onChange={(e) => this.handleSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.sauces.includes("Garlic Sauce")} label="Garlic Sauce" value="Garlic Sauce" onChange={(e) => this.handleSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.sauces.includes("Asian Sweet Sauce")}label="Asian Sweet Sauce" value="Asian Sweet Sauce" onChange={(e) => this.handleSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.sauces.includes("Hot Sauce")} label="Hot Sauce" value="Hot Sauce" onChange={(e) => this.handleSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.sauces.includes("RIce Wine Sauce")} label="Rice Wine Sauce" value="Rice Wine Sauce" onChange={(e) => this.handleSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.sauces.includes("Oyster Sauce")} label="Oyster Sauce" value="Oyster Sauce" onChange={(e) => this.handleSauceChange(e)}/>
                                </Form>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Label><p>Step 5: Choose To-Go Sauces</p></Form.Label>
                                    <Form.Check defaultChecked = {this.state.toGoSauces.includes("Mongolian Sauce")} label="Mongolian Sauce" value="Mongolian Sauce" onChange={(e) => this.handleToGoSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.toGoSauces.includes("Hot Sauce")} label="Hot Sauce" value="Hot Sauce" onChange={(e) => this.handleToGoSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.toGoSauces.includes("Hoisin Sauce")} label="Hoisin Sauce" value="Hoisin Sauce" onChange={(e) => this.handleToGoSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.toGoSauces.includes("Soy Sauce")} label="Soy Sauce" value="Soy Sauce" onChange={(e) => this.handleToGoSauceChange(e)}/>
                                    <Form.Check defaultChecked = {this.state.toGoSauces.includes("Sriracha")} label="Sriracha" value="Sriracha" onChange={(e) => this.handleToGoSauceChange(e)}/>
                                </Form>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Button onClick={() => this.decrementStage()} style={{marginRight: '0.5rem'}}>
                                        Back
                                </Button>
                                <Button onClick={() => this.advanceStage()}>
                                        Next
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )

        } else if (this.state.stage === 3) {
            grillOrderForm = 
                (
                    <div>
                        <Row>
                            <Col>
                                <p>Step 6: Review</p>
                                <p>Protein: {this.state.baseProtein}</p>
                                <p>Toppings/Ingredients: </p>
                                <ul>
                                    {this.state.additionalIngredients.map(ingredient => {
                                        return (
                                            <li>
                                                {ingredient}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label><p>Step 7: Additional Insturctions (Allergies, etc.)</p></Form.Label>
                                    <Form.Control as="textarea" rows="3" name="additionalInstructionsGrill" onChange = {(e) => this.handleChange(e)}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button onClick={() => this.decrementStage()} style={{marginRight: '0.5rem'}}>
                                    Back
                                </Button>
                                <Button onClick={() => this.addToOrderGrill()}>
                                    Add to Order
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )
        } else {
            grillOrderForm = 
                (
                    <div>
                        <Row>
                            <Col className="text-center">
                                <p>Thank you for placing your order!</p>
                                <Button onClick = {() => this.reset()}>
                                    Order More
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )
        }

        let grillOrders; 

        grillOrders = this.state.grillOrders.length == 0 ? <p>No Grill Orders</p> : 
            (
                this.state.grillOrders.map((grillOrder, index) => 
                    (
                        <Card body style={{marginBottom: '1rem'}}>
                            <div>
                                <p>1x Grill Order:</p>
                                <ul>
                                    <li>Base Protein: <p>{grillOrder.baseProtein}</p></li>
                                    <li>Ingredients/Toppings: <p>{isEmpty(grillOrder.additionalIngredients) ? "None" : grillOrder.additionalIngredients.join(', ')}</p></li>
                                    <li>Sauces: <p>{isEmpty(grillOrder.sauces) ? "None": grillOrder.sauces.join(', ')}</p></li>
                                    <li>To-Go Sauces: <p>{isEmpty(grillOrder.toGoSauces) ? "None" : grillOrder.toGoSauces.join(', ')}</p></li>
                                    <li>Additional Instructions: {isEmpty(grillOrder.additionalInstructionsGrill) ? <p> None </p> : <p>{grillOrder.additionalInstructionsGrill}</p>}</li>
                                    <li>Price: {this.getGrillPriceForCart(index)} </li>
                                </ul>
                                <Button onClick={() => this.removeFromOrders(grillOrder.id)}>
                                    Remove
                                </Button>
                            </div>
                        </Card>
                    )
                )
            )

        ////////////////// KITCHEN MENU ////////////////////////

        let kitchenMenu;

        kitchenMenu = 
            (
                <div>
                    <h5 style={{marignTop: '1rem'}}>Entrees</h5>
                    <EntreeCard name="Bulgolgi Bowl" desc="famous korean dish, sliced beef marinated in soy sauce" price="13.99" type="entree" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Spicy Pork Bulgolgi Bowl" desc="famous korean dish, sliced pork marinated in spicy chili sauce" price="12.99" type="entree" addToOrder={this.addToOrderKitchen}/>
                    {/* <EntreeCard name="Orange Chicken Bowl" desc="orange chicken served with rice" price="9.99" type="entree" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Pineapple Chicken Bowl" desc="pineapple chicken served with rice" price="9.99" type="entree" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Garlic Chicken Bowl" desc="garlic chicken served with rice" price="9.99" type="entree" addToOrder={this.addToOrderKitchen}/> */}

                    <h5 style={{marginTop: '1.5rem'}}>Sides/Appetizers</h5>
                    <EntreeCard name="Egg Rolls" desc="2 pcs. per order" price="3.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Chicken Wings (Regular)" desc="6 pcs. per order" price="5.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Chicken Wings (Honey Garlic)" desc="6 pcs. per order" price="5.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Chicken Wings (Spicy Honey Garlic)" desc="6 pcs. per order" price="5.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Chicken Wings (Orange Honey Garlic)" desc="6 pcs. per order" price="5.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Gyoza (4 pcs.)" desc="4 pcs. per order" price="3.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Gyoza (6 pcs.)" desc="6 pcs. per order" price="4.99" type="side" addToOrder={this.addToOrderKitchen}/>
                    <EntreeCard name="Kimchi" desc="side portion" price="1.99" type="side" addToOrder={this.addToOrderKitchen}/>
                </div>
            )

        let kitchenOrders;

        kitchenOrders = this.state.kitchenOrders.length === 0 ? <p>No Kitchen Orders</p> : 
            (
                this.state.kitchenOrders.map((kitchenOrder, index) => 
                    <Card body style={{marginBottom: '1rem'}}>
                        <Row> 
                            <Col md={5}>
                                <Row>
                                    <Col>
                                        <p>{kitchenOrder.name}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p> {kitchenOrder.desc}</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <p>Quantity:</p>
                                <NumericInput
                                    style={{input:{pointerEvents: 'none'}}}
                                    min={1}
                                    value={this.state.kitchenOrders[index].quantity}
                                    onChange={(valueAsNumber) => this.updateQuantity(index, valueAsNumber)}
                                />
                            </Col>
                            <Col>
                                <p>Price: ${kitchenOrder.price}</p>
                                <Button style={{marginTop: 'auto', marginBottom: 'auto'}} onClick={() => this.removeFromOrdersKitchen(kitchenOrder.id)}>Remove</Button>
                            </Col>
                        </Row>
                    </Card>
                )
            )
        
        ////////////////// DRINKS MENU ///////////////////////

        let drinksMenu;

        drinksMenu = 
                (
                    <div>
                        <h5>Fountain Drinks</h5>
                        <EntreeCard name="Pepsi" price = "2.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Mountain Dew" price = "2.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Sierra Mist" price = "2.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Mug Root Beer" price = "2.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Dr. Pepper" price = "2.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <br/>
                        {/* <h5>Bubble Tea</h5>
                        <EntreeCard name="Thai (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Thai (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Black (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Black (with tapioca pearls)"price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Taro (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Taro (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Matcha (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Matcha (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Lavender (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Lavender (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Strawberry (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Strawberry (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Mango (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Mango (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Coconut (no pearls)" price = "3.99" type="drink" addToOrder={this.addToOrderKitchen}/>
                        <EntreeCard name="Coconut (with tapioca pearls)" price = "4.49" type="drink" addToOrder={this.addToOrderKitchen}/> */}
                    </div>
                )


        ////////////////// ORDER PAGE WHOLE ////////////////////////////

        let orderPage;

        let availableText = this.state.restaurantAvailable ? "Thank you for visiting our online order form! We are currently closed. Our hours are as follows:" 
        : "Our online order form is currently closed for today. We are still open in person at the hours below, and we are still available on Uber Eats and Door Dash."
              
        
        let openText = this.state.restaurantAvailable ? "The online order form will re-open during these times. Thank You!" 
        : "Please check back tomorrow for the online order form's availability"

        let hoursColumn;
        
        hoursColumn = (
            <div>
                <p>Mon-Sat: 12PM - 8PM</p>
                <p>Sun: 12PM - 7PM</p>
                <p>Gig Harbor is Closed on Sundays</p>
                <p>{openText}</p>
            </div>
        ) 

        const { errors } = this.state;

        if(isEmpty(this.state.available)) {
            orderPage = 
                (
                    <Row style={{marginTop: '5rem'}}>
                        <Col className="text-center">
                            <img src={require("../images/logo.png")}/>
                            <Lottie options={animationOptionsLoading} width={100} height={100}/>
                            <p>Just a Moment, Please</p>
                        </Col>
                    </Row>
                )
        } else if (!this.state.available) {
        
            orderPage = 
                (
                    <Row style={{marginTop: '5rem'}}>
                        <Col className="text-center">
                            <img src={require("../images/logo.png")} style={{marginBottom: '1rem'}}/>
                            <p>{availableText}</p>
                            {hoursColumn}
                            <Button href="/">Home</Button>
                        </Col>
                    </Row>
                )
            
        } else {
            orderPage = 
                (
                    <Container fluid style={{marginBottom: '1rem', marginTop: '1rem', width: '90vw', fontFamily: 'montserrat'}}>
                        <ToastContainer pauseOnHover={false} autoClose={1500}/>
                        <Modal show={this.state.showModal} size="lg" centered id="contained-modal-title-vcenter">
                            <Modal.Header>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Place Order
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        <p>Please fill out the following information to place your order. You will receive and email confirmation, and a text notification (optional)</p>
                                    </Col>
                                </Row>
                                <Form noValidate className='text-left' >
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Control type="name" placeholder="Name" name = "name" value={this.state.name} onChange = {(e) => this.handleChange(e)} className={"form-control", classnames({
                                                "is-invalid": errors.name,
                                            })}/>
                                            {errors.name && (
                                                <div className="invalid-feedback">{errors.name}</div>
                                            )}
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control autoComplete="off" type="email" placeholder="Email Address" name = "email" value={this.state.email} onChange = {(e) => this.handleChange(e)} className={"form-control", classnames({
                                                "is-invalid": errors.email,
                                            })}/>
                                            {errors.email && (
                                                <div className="invalid-feedback">{errors.email}</div>
                                            )}
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Control type="phone" placeholder="Phone Number (Format: 1234567890)" name = "phone" value={this.state.phone} onChange = {(e) => this.handleChange(e)} className={"form-control", classnames({
                                                "is-invalid": errors.phone,
                                            })}/>
                                            {errors.phone && (
                                                <div className="invalid-feedback">{errors.phone}</div>
                                            )}
                                    </Form.Group>
                                    <Form.Check label="Recieve Text For Order Confirmation" defaultChecked ={this.state.receiveText} onChange={() => this.setState({receiveText: !this.state.receiveText})}/>
                                </Form>
                                <hr/>
                                <Row>
                                    <Col>
                                        <h5>Review Order Total:</h5>        
                                        <p>Pickup Location: {this.state.location}</p>
                                        <p>Subtotal: ${this.state.subtotal}</p>
                                        {/* <p>Buy one get one 50% off (entree/grill): -${this.state.deal} (${this.state.subtotal - this.state.deal})</p> */}
                                        <p>Tax ({this.state.location === "Gig Harbor" ? "8.7%" : "9%"}): ${this.state.tax}</p>
                                        <p>Total: ${this.state.total}</p>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.setState({showModal: false})}>Back</Button>
                                <Button onClick={() => this.validateInput()}>Place Order</Button>
                            </Modal.Footer>
                        </Modal>
                        <Row>
                            <Col>
                                <h1>Online Order Form (Gig Harbor is Closed on Sundays)</h1>
                                {/* <h1> Online Order Form (Gig Harbor is closed temporarirly. We apologize for any incovenience).</h1> */}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card body className="shadow-sm" id="order-form">
                                    <Row>
                                        <Col>
                                            <Tabs defaultActiveKey="grill" id="uncontrolled-tab-example"> 
                                                <Tab eventKey="grill" title="Mongolian Grill">
                                                    <div style={{marginTop: '2rem'}}>
                                                        <Row>
                                                            <Col>
                                                                <p>Order Mongrolian Grill (served with rice and miso soup) using the form below:</p>
                                                                <p>Lunch: $10.99</p>
                                                                <p>Dinner: $13.99</p>
                                                                <p>We are currently serving: {this.state.lunch? "Lunch" : "Dinner"}</p>
                                                            </Col>
                                                        </Row>
                                                        <hr/>
                                                        <Row>
                                                            <Col>
                                                                {grillOrderForm}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="kitchen" title="Kitchen Menu">
                                                    <div style={{marginTop: '2rem'}}>
                                                        <Row>
                                                            <Col>
                                                                <p>Order from our Kitchen Menu:</p>
                                                                {/* <p>We are offering a "buy one get one 50% off" promotion (entrees and grill orders only)! Promotion will show when adding two or more items to your order (applies only once per order).</p> */}
                                                            </Col>
                                                        </Row>
                                                        <hr/>
                                                        <Row>
                                                            <Col>
                                                                {kitchenMenu}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="drinks" title="Drinks">
                                                    <div style={{marginTop: '2rem'}}>
                                                        <Row>
                                                            <Col>
                                                                <p>Add any Pepsi fountain drinks to your order for $2.49</p>
                                                                {/* <p>We also sell bubble tea for $3.99 (+$0.50 for tapioca pearls)</p>
                                                                <ul>
                                                                    <li>Our flavors include: thai, black, taro, matcha, lavender, strawberry, pineapple, mango</li>
                                                                </ul> */}
                                                            </Col>
                                                        </Row>
                                                        <hr/>
                                                        <Row>
                                                            <Col>
                                                                {drinksMenu}
                                                            </Col>
                                                        </Row>

                                                    </div>
                                                </Tab>
                                            </Tabs>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Card body className="shadow-sm" id="cart">
                                    <Row>
                                        <Col>
                                            <h3>Review Order</h3>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col md={6}>
                                            <h5>Mongolian Grill Orders</h5>
                                            {grillOrders}
                                        </Col>
                                        <Col md={6}>
                                            <h5>Kitchen Orders/Drinks</h5>
                                            {kitchenOrders}
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>
                                            <h5>Additional Instructions for Order (i.e. "Extra Chopsticks, Napkins, etc.")</h5>
                                            <Form.Control as="textarea" rows="3" name="additionalInstructionsOrder" onChange = {(e) => this.handleChange(e)}/>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>
                                            <Form>
                                                <Form.Label>Choose Pickup Location: </Form.Label>
                                                <Form.Control 
                                                    as="select"
                                                    name="location"
                                                    onChange={(e) => this.handleChangeLocation(e)}
                                                >
                                                    <option value = "Silverdale">Silverdale</option>
                                                    <option value = "Gig Harbor" disabled={this.getTimePST().getDay() == 0}>Gig Harbor</option>
                                                </Form.Control>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop: '1rem'}}>
                                        <Col>
                                            <p>Subtotal: ${this.state.subtotal}</p>
                                            {/* <p>Buy one get one 50% off (entree/grill): -${this.state.deal} (${this.state.subtotal - this.state.deal})</p> */}
                                            <p>Tax ({this.state.location === "Gig Harbor" ? "8.7%" : "9%"}): ${this.state.tax}</p>
                                            <p>Total: ${this.state.total}</p>
                                            <Button onClick={() => this.setState({showModal: true})} disabled={(this.state.grillOrders.length + this.state.kitchenOrders.length) < 1}>Continue to Place Order</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )
        }


        return orderPage
    }
}

export default Order;