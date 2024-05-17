const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config();

app.use(bodyParser.json({ extended: true, limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors());

// Routes
const employer = require('./route/userRoute');
const supplier = require('./route/supplierRoute');
const userTime = require('./route/userActiveTimeRoute');
const category = require('./route/categoryRoutes');
const product = require('./route/productRoute');
const productDetails = require('./route/productDetailsRoute');
const customer = require('./route/customerRoute');
const invoice = require('./route/invoiceRoute');
const hsn = require('./route/hsnRoute');
const noOfUnit = require('./route/noOfRoute');
const tax = require('./route/taxRoutes');
const inVoiceDetailsModule = require('./moduls/invoiceModule');
const productModule = require('./moduls/productModule');
const customerModule = require('./moduls/customer');
const supplierModule = require('./moduls/supplierModule');
const categoryModule = require('./moduls/categoryModule');

// Database connection
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.log('Database connection failed', err);
  });

// API routes
app.use('/user', employer);
app.use('/supplier', supplier);
app.use('/product', product);
app.use('/userTime', userTime);
app.use('/client', customer);
app.use('/product_details', productDetails);
app.use('/category', category);
app.use('/invoice', invoice);
app.use('/hsn', hsn);
app.use('/noOfUnit', noOfUnit);
app.use('/tax', tax);

// Mainpage route
app.get('/mainpage', async (req, res) => {
  try {
    const sale = await inVoiceDetailsModule.find({});
    const product = await productModule.find({});
    const customer = await customerModule.find({});
    const supplier = await supplierModule.find({});
    const category = await categoryModule.find({});

    res.status(200).json({
      message: "Response Received",
      categories: category.length,
      products: product.length,
      customers: customer.length,
      suppliers: supplier.length,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({
      message: "An error occurred while fetching sales data"
    });
  }
});

// Last invoices route
app.get('/lastInvoices', async (req, res) => {
  try {
    const sale = await inVoiceDetailsModule.find({});
    res.status(200).json({
      message: "Response Received",
      sales: sale[0].arr.slice(0, 3),
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({
      message: "An error occurred while fetching sales data"
    });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route to handle all client-side routes and serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
