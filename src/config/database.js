const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://animeshkr13:Ak_ele14@cluster0.f2jse5g.mongodb.net/');
}

connectDB()
  .then(res => console.log("connection established"))
  .catch(err => console.log(err));