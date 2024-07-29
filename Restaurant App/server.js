const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MenuItem,Order,OrderR,Driver,Image } = require('./models/models');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://zohaibbabarali:UTc5XAcNAaMqF48u@zohaibdb.ck699kd.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// uncomment code from line 16 to 63 to create menu item in database

// const menuItemSchema = new mongoose.Schema({
//   name: String,
//   price: Number
// });

// const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// const orderSchema = new mongoose.Schema({
//   customerName: String,
//   delivery_address: String,
//   menuItem: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'MenuItem'
//   },
//   quantity: Number,
//   totalOrderPrice: Number,
//   orderDate: Date,
// });

// const Order = mongoose.model('Order', orderSchema);



// Uncomment the following block to initially populate the menu in the database
// Example menu items
// const initialMenuItems = [
//   { name: 'Butter Chicken', price: 10.99 },
//   { name: 'Chicken Biryani', price: 15.99 },
//   { name: 'Rice Bowl', price: 5.99 },
//   { name: 'Veg Biryani', price: 8.99 },
//   { name: 'Plain Rice', price: 7.99 },
//   { name: 'Chicken BBQ', price: 9.99 },
//   { name: 'Chicken Grilled', price: 25.99 },
//   { name: 'Chicken Grilled With Butter', price: 18.99 },
//   { name: 'Chicken Wrap', price: 10.99 },
//   { name: 'Orange Juice', price: 12.99 },
//   { name: 'Lemonade', price: 5.99 },
//   { name: 'Apple Juice', price: 10.99 }

// ];

// MenuItem.insertMany(initialMenuItems)
//   .then(() => {
//     console.log('Menu items added to the database');
//   })
//   .catch((err) => {
//     console.error('Error adding menu items to the database:', err);
//   });

app.get('/', async (req, res) => {
  const menuItems = await MenuItem.find();
  res.render('index', { menuItems });
});

app.get('/order', async (req, res) => {
  const menuItems = await MenuItem.find();
  res.render('order', { menuItems });
});



app.post('/place-order', async (req, res) => {
  try {
    const customerName = req.body.customerName;
    const deliveryAddress = req.body.delivery_address; 
    const menuItemId = req.body.menuItem;
    const quantity = req.body.quantity;

    const selectedMenuItem = await MenuItem.findById(menuItemId);

    if (!selectedMenuItem) {
      return res.status(404).send('Menu item not found');
    }

    const totalOrderPrice = selectedMenuItem.price * parseInt(quantity);

    const newOrder = new Order({
      customerName,
      delivery_address: deliveryAddress, 
      menuItem: selectedMenuItem._id,
      quantity: parseInt(quantity),
      totalOrderPrice: totalOrderPrice, 
      status:'READY FOR DELIVERY',
    });

    await newOrder.save();


    selectedMenuItem.totalSales += totalOrderPrice;
    await selectedMenuItem.save();

    const menuItemDetails = {
      _id: selectedMenuItem._id,
      name: selectedMenuItem.name,
      price: selectedMenuItem.price
    };
    res.render('order-confirmation', {
      order: {
        _id: newOrder._id,
        customerName: newOrder.customerName,
        delivery_address: newOrder.delivery_address,
        menuItem: menuItemDetails,
        quantity: newOrder.quantity,
        totalOrderPrice: newOrder.totalOrderPrice
      }
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.render('order-status');
});

app.post('/check-order-status', async (req, res) => {
    const errorMessage = "";
    const order = await Order.find();
    const selectedOrder = Object.values(order).filter(e => e._id == req.body.orderId);
    if(selectedOrder == null || selectedOrder.length <= 0)
    {
      errorMessage = "Enter valid Order Id!";
    }  
    res.render('order-status-result', { orderId: req.body.orderId, order: selectedOrder[0], error: errorMessage });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
