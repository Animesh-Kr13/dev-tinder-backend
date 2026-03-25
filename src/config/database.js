const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://animeshkr13:Ak_ele14@cluster0.f2jse5g.mongodb.net/devTinder');
}

module.exports={
  connectDB
}