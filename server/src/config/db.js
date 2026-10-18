const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the MONGO_URI environment variable.
 * Throws if the URI is missing so misconfiguration fails fast and loudly.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Copy server/.env.example to server/.env and set it.');
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
