const mongoose = require('mongoose');
const fs = require('fs');
const Temperature = require('./models/Temperature');
require('dotenv').config();

async function run() {
  try {
    const rawData = fs.readFileSync('history.json', 'utf8');
    const records = JSON.parse(rawData);

    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB.");
      
      await Temperature.deleteMany({});
      console.log("Cleared old records.");
      
      await Temperature.insertMany(records);
      console.log(`Successfully inserted ${records.length} records into MongoDB.`);
      
      mongoose.disconnect();
    } else {
      console.log("No MONGO_URI found.");
    }
  } catch (err) {
    console.error(err);
  }
}

run();
