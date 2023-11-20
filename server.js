require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// Gunakan middleware CORS
app.use(cors());

// Middleware logging untuk setiap permintaan
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// parse application/json
app.use(bodyParser.json());

let routes = require('./routes/main_route');
routes(app);

app.listen(port, () => {
    console.log('RESTful API server started on: ' + port);
});
