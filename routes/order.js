const Router = require("express-promise-router");
const router = new Router();

var orderController = require("../controllers/orderController")

module.exports = router;

router.post('/create/wok-on-fire', orderController.createOrderWokOnFire)