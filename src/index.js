process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
/** Defining Variable To Use In File */
let port = process.env.PORT;
let dbConfig = process.env.MONGODB_CONNECTION_STRING;
/** End Defining Variable To Use In File */

let invoiceController = require('./app/V1/POS/controllers/invoicePrint')

mongoose.set("strictQuery", false);
mongoose.connect(dbConfig).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.get('/pdf', function (req, res) {

    invoiceController.customeOrderPrint(req.query.order_id)
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })