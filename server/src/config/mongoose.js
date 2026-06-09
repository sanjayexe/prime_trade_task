const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  return mongoose.connection;
}

module.exports = { connectDatabase };