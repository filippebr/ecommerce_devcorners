const { default: mongoose } = require("mongoose");
const URL = process.env.MONGODB_URL;

const dbConnect = () => {
  try {
    const conn = mongoose.connect(URL);    
    console.log("Mongodb connected");
  } catch (err) {
    console.log("Database error");
  }
}

module.exports = dbConnect