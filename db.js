const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To MongoDB Atlas");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToMongo;