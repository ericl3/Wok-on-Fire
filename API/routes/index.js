const order = require("./order")

module.exports = app => {
    app.use("/order", order)
}