const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://vermanick:abcd12345@cluster0.4zdlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("ModelData"); 
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
