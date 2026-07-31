const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Temperature = require("./models/Temperature"); // Assuming this is your mongoose model

dotenv.config();

// Change this to the name of your text file!
const FILE_PATH = "user_data.json"; 

async function bulkImport() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    console.log(`Reading data from ${FILE_PATH}...`);
    const rawData = fs.readFileSync(FILE_PATH, "utf8");
    
    // If your text file is a JSON array: [ {...}, {...} ]
    let parsedData = [];
    try {
      parsedData = JSON.parse(rawData);
    } catch (e) {
      // If it's a file with one JSON object per line (JSONL format)
      console.log("File is not a strict JSON array, attempting to parse line by line...");
      const lines = rawData.split('\n');
      for (let line of lines) {
        if (line.trim()) {
          try {
            parsedData.push(JSON.parse(line));
          } catch (err) {
            console.error("Skipping invalid line:", line);
          }
        }
      }
    }

    console.log(`Found ${parsedData.length} valid records. Inserting into database...`);
    
    // Add timestamps if they don't exist
    const docsToInsert = parsedData.map(record => ({
      temperature: record.temperature,
      speed: record.rpm || record.speed,
      vibration: record.vibration,
      current: record.current,
      createdAt: new Date()
    }));

    await Temperature.insertMany(docsToInsert);
    console.log("🎉 Bulk import completed successfully!");

  } catch (error) {
    console.error("Error during bulk import:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

bulkImport();
