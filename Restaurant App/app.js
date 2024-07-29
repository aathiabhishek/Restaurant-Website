const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { MenuItem,Order,OrderDelivery,Driver,imgSchema} = require('./models/models');

const fs = require('fs');

const path = require('path');

require('dotenv').config();

const app = express();
const port = 4000;

mongoose.connect('mongodb+srv://rahul:aHYSuPN7o6TxbwkF@zohaibdb.ck699kd.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000, socketTimeoutMS: 30000 });

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()) 

app.use(express.static('public'));

app.use('/uploads',express.static('uploads'))    

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index1');
});

app.get('/register', (req, res) => {
res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, vehicleModel, color, licensePlate } = req.body;
    const newDriver = new Driver({
      username,
      password,
      fullName,
      vehicleModel,
      color,
      licensePlate,
    });
    await newDriver.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.redirect('/register');
  }
});


app.get('/login', (req, res) => {
  res.render('login.ejs');

});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const driver = await Driver.findOne({ username, password });
  if (driver) {
    const order = await Order.find();
    res.render('index2', { order });
    
  } else {
    res.redirect('/login');
  }
});

app.get('/open-orders', async (req, res) => {
  try {
    
    const order = await Order.find();
    res.render('index2', { order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


 app.post('/select-order/:orderId', async (req, res) => { // new args added
   const { orderId } = req.params;
   const username = req.username;
   await Order.findByIdAndUpdate(orderId, { status: 'IN TRANSIT' });
   const openOrders = await Order.find({ status: 'READY FOR DELIVERY' });
   const selectedOrder = await Order.findById(orderId);
   res.render('dashboard.ejs', { openOrders, selectedOrder, username });
 });



app.post('/fulfillment/:orderId', upload.single('image'), async (req, res, next) => {
    var obj = {
    
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgSchema.create(obj)
    .then ((err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            
            res.redirect('/select-order');
        }
    });
  const { orderId } = req.params;
  const { status } = req.body;
  const proofImage = req.file.filename;
  const username = req.username;

  await Order.findByIdAndUpdate(orderId, { status, proofImage });
  const openOrders = await Order.find({ status: 'READY FOR DELIVERY' });
  res.render('dashboard.ejs', { openOrders, selectedOrder: null, username });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
