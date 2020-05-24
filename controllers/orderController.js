const isEmpty = require("../validation/isEmpty");
const sgMail = require('@sendgrid/mail');
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const accountSid = 'AC4a53ad811df54d6b9decae8d719380aa';
const authToken = process.env.TWILIO_API_KEY
const twilioClient = require('twilio')(accountSid, authToken);

exports.createOrderWokOnFire = async(req, res) => {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var location = req.body.location;
    var grillOrders = req.body.grillOrders;
    var kitchenOrders = req.body.kitchenOrders;
    var additionalInstructionsOrder = req.body.additionalInstructionsOrder;
    var subtotal = req.body.subtotal
    var deal = req.body.deal
    var tax = req.body.tax
    var total = req.body.total
    var receiveText = req.body.receiveText

    console.log(req.body)

    if (receiveText) {
        try {
            await sendText(name, phone, email, location)
            return res.status(200).send({success: "Text sent successfully"})
        } catch (err) {
            return res.status(400).send({ error: err})
        }
    }
    
    // try {
    //     await sendEmailCustomer(name, phone, email, location, order, instructions, price);
    // } catch (err) {
    //     console.log(err);
    //     return res.status(400).send({ error: err })
    // }

    // return res.status(200).send({ success: "Order submitted successfully"})

}

const sendEmailCustomer = async (name, phone, email, location, order, instructions, price) => {
    const msg = {
        to: email,
        from: 'wokonfirebusiness@gmail.com',
        subject: 'Your Wok on Fire Order',
        text: 'Hey! This is your order!'
    }

    return await sgMail.send(msg);
}

const sendText = async (name, phone, email, location) => {
    if (location === "Gig Harbor") {
        replyPhone = "(253) 358-3071"
    } else { 
        replyPhone = "(360) 692-3414"
    }

    textMessage = 'Hi ' + name.split(" ")[0] + ', \n \n' 
        + 'Thank you for placing an order at Wok on Fire (' + location + '). You should have received an order confirmation at your email address: '+ email + '. \n \n' 
        + 'Your order will be ready for pickup in around 15-20 minutes. \n \n' 
        + 'If you have any questsions about your order, please call us at ' + replyPhone + '\n \n'
        + '(This is an automated message from an unmonitored phone number. Use above number for inquiries). \n \n'
        + 'Thank you!'
    twilioClient.messages
        .create({
            body: textMessage,
            from: '+12057281637',
            to: phone
        })
        .then(message => console.log(message.sid));
}