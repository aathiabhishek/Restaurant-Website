const mongoose = require('mongoose');


const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number
  });
  
  const MenuItem = mongoose.model('MenuItem', menuItemSchema);

  const orderSchema = new mongoose.Schema({
    customerName: String,
    delivery_address: String,
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },
    quantity: Number,
    totalOrderPrice: Number,
    status: String,
    
  });

  const Order = mongoose.model('Order', orderSchema);

 
  
  const Driver = mongoose.model('Driver', {
    username: String,
    password: String,
    fullName: String,
    vehicleModel: String,
    color: String,
    licensePlate: String,
  });

  const deliveryOrder = new mongoose.Schema({
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },

    Order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    

    Driver:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    }
  });
  
  const OrderDelivery = mongoose.model('OrderDelivery', deliveryOrder);


  const imageSchema = new mongoose.Schema({
	
	
    img:
    {
      data: Buffer,
      contentType: String
    }
  });
  const imgSchema = mongoose.model('imgSchema', imageSchema);


  module.exports = {MenuItem,Order,OrderDelivery,Driver,imgSchema};