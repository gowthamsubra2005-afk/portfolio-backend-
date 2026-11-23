const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB WARNING] MONGODB_URI is not set in environment variables.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB SUCCESS] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[DB ERROR] MongoDB Connection Failed: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
