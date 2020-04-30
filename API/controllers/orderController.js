const isEmpty = require("../validation/isEmpty");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createOrderWokOnFire = async(req, res) => {
    var name = req.body.name;
    var phone = req.body.phone;
    var location = req.body.locatoin;
    var order = req.body.order;
    var instructions = req.body.instructions;
    var price = req.body.price;


}