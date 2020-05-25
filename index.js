const https = require('https');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./routes')

const app = express();
app.use(cors());

// Use body-parser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));
  
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

// Calling this will mount the routes onto the express app. (Using the code found in index.js within routes foler)
mountRoutes(app)

app.listen(process.env.PORT || 0915, () => {
    console.log('Wok-on-Fire API running on port 0915!')
});