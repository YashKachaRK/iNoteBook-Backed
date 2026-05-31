// use mongo 
// make connection 

const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/iNoteBook"

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log("Connected To mongo success");


  } catch (error) {
    console.log(error)
  }

}

module.exports = connectToMongo;