const isEmpty = require("../validation/isEmpty");
const sgMail = require('@sendgrid/mail');
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const accountSid = 'AC4a53ad811df54d6b9decae8d719380aa';
const authToken = process.env.TWILIO_API_KEY
const twilioClient = require('twilio')(accountSid, authToken);

exports.createOrderWokOnFire = async(req, res) => {
    var oid = Math.random().toString(36).substr(2, 7)
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var location = req.body.location;
    var grillOrders = req.body.grillOrders;
    var kitchenOrders = req.body.kitchenOrders;
    var additionalInstructionsOrder = isEmpty(req.body.additionalInstructionsOrder) ? "None" : req.body.additionalInstructionsOrder;
    var subtotal = req.body.subtotal
    var deal = req.body.deal
    var tax = req.body.tax
    var total = req.body.total
    var subtotalMinusDeal = subtotal - deal
    var receiveText = req.body.receiveText
    var lunch = req.body.lunch
    var replyPhone = location === "Gig Harbor" ? "(253) 358-3071" : "(360) 692-3414"

    for (var i = 0; i < grillOrders.length; i++) {
        grillOrders[i].additionalIngredients = isEmpty(grillOrders[i].additionalIngredients) ? "None" : grillOrders[i].additionalIngredients.join(", ")
        grillOrders[i].sauces = isEmpty(grillOrders[i].sauces) ? "None" : grillOrders[i].sauces.join(", ")
        grillOrders[i].toGoSauces = isEmpty(grillOrders[i].toGoSauces) ? "None" : grillOrders[i].toGoSauces.join(", ")
        if (lunch) {
            grillOrders[i].price  = (9.99 + grillOrders[i].proteinExtraPrice)
        } else {
            grillOrders[i].price = (13.99 + grillOrders[i].proteinExtraPrice)
        }
    }
    
    const receiptPayload = {
        name: name,
        oid: oid,
        location: location,
        email: email,
        grillOrders: grillOrders,
        kitchenOrders: kitchenOrders,
        additionalInstructionsOrder: additionalInstructionsOrder,
        subtotal: subtotal,
        deal: deal,
        subtotalMinusDeal: subtotalMinusDeal,
        tax: tax,
        total: total,
        replyPhone: replyPhone,
        phone: phone,
        orderType: lunch ? "Lunch" : "Dinner"
    }

    console.log(req.body)

    if (receiveText) {
        try {
            await sendText(name, phone, email, location)
        } catch (err) {
            return res.status(400).send({ error: err})
        }
    }

    try {
        await sendEmailCustomer(receiptPayload)
    } catch (err) {
        return res.status(400).send({ error: err})
    }

    try {
        await sendEmailEmployees(receiptPayload)
        return res.status(200).send({success: "Booyah"})
    } catch (err) {
        console.log(err)
        return res.status(400).send({error: err})
    }

}

const sendEmailCustomer = async (receiptPayload) => {
    const msg = {
        from: 'wokonfirebusiness@gmail.com',
        personalizations: 
            [
                {
                    to: [{email: receiptPayload.email}],
                    dynamic_template_data: receiptPayload
                }

            ],
        template_id: "d-144ea8776f434748a1cf1e6aaa07b6ab"
    }

    return await sgMail.send(msg);
}

const sendEmailEmployees = async (orderPayload) => {
    const msg = {
        from: 'wokonfirebusiness@gmail.com',
        personalizations: 
            [
                {
                    to: [{email: "wokonfirebusiness@gmail.com"}],
                    dynamic_template_data: orderPayload
                }

            ],
        template_id: "d-238740c3480f42278110a7ff2398a1b5"
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

    toTheFamily = "There is an order for " + location + " from " + name + ". Please check your email! Please check your email!"

    //cheyenne dad 2533895658

    phoneNumbers = ['2538207087', '3604713076', '2533895658']

    for (var i = 0; i < phoneNumbers.length; i++) {
        twilioClient.messages
        .create({
            body: toTheFamily,
            from: '+12057281637',
            to: phoneNumbers[i]
        }).then(
            twilioClient.calls.create({
                twiml: '<Response><Say>You have an order, check your email!</Say></Response>',
                from: '+12057281637',
                to: phoneNumbers[i]
            })
        )
    }



}