const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const { MenuItem,Order,OrderDelivery,Driver,Image } = require('./models/models');

const path = require('path');

require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()) 

app.use(express.static('public'));

app.use('/uploads',express.static('uploads'))    
// Set up EJS as the view engine
app.set('view engine', 'ejs');

const port = 5000;

// Connect to MongoDB

mongoose.connect('mongodb+srv://aathi:k5f929YumLceh61M@zohaibdb.ck699kd.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000, socketTimeoutMS: 30000 });

app.get('/', async (req, res) => {
  try {
    
    const order = await Order.find();
    res.render('home', { order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/orders', async (req, res) => {
  try {
    const ordersFromDB = await Order.find();
    return res.render('orders', { orders: ordersFromDB });
  } catch (error) {
    console.error(error);
   return res.status(500).send('Internal Server Error');
  }
});


app.get('/completed-orders', async (req, res) => {
  try {
    
    const order = await Order.find();
    res.render('completed-orders', { order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.search; 
    const ordersFromDB = await Order.find({ customerName: searchTerm });
    if (ordersFromDB.length === 0) {
      
      return res.render('customer', { searchTerm });
    }
    return res.render('search', { orders: ordersFromDB, searchTerm });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
    
});
