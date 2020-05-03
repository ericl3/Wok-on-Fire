const isEmpty = require("../validation/isEmpty");
const sgMail = require('@sendgrid/mail');
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createOrderWokOnFire = async(req, res) => {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var location = req.body.locatoin;
    var order = req.body.order;
    var instructions = req.body.instructions;
    var price = req.body.price;
    
    try {
        await sendEmailCustomer(name, phone, email, location, order, instructions, price);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err })
    }

    return res.status(200).send({ success: "Order submitted successfully"})

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