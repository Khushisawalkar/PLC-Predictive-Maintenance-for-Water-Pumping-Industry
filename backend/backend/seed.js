const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Temperature = require('./models/Temperature');
require('dotenv').config();

const transcriptPath = "C:\\Users\\khush\\.gemini\\antigravity-ide\\brain\\f3884efb-cc19-4aca-9807-76f8b1f36355\\.system_generated\\logs\\transcript.jsonl";

async function run() {
  console.log("Reading transcript to extract data...");
  const data = fs.readFileSync(transcriptPath, 'utf8');
  const lines = data.split('\n');
  
  let rawText = "";
  for (const line of lines) {
    if (!line) continue;
    try {
       const parsed = JSON.parse(line);
       if (parsed.type === "USER_INPUT" && parsed.content.includes("vibration")) {
          rawText += parsed.content + "\n";
       }
    } catch(e) {}
  }

  // Parse the rawText looking for JSON blocks
  const regex = /\{\s*"vibration":\s*[\d.-]+,\s*"temperature":\s*[\w.-]+,\s*"rpm":\s*[\d.-]+,\s*"current":\s*[\d.-]+\s*\}/g;
  const matches = rawText.match(regex);
  
  if (!matches) {
    console.log("No data found in transcript.");
    return;
  }
  
  const records = matches.map(m => {
    // Some temperatures are 'nan', replace them with 0 or a valid number
    const cleaned = m.replace(/"temperature":\s*nan/g, '"temperature": 0');
    try {
      const obj = JSON.parse(cleaned);
      return {
        temperature: obj.temperature,
        speed: obj.rpm,
        vibration: obj.vibration,
        current: obj.current
      };
    } catch(e) { return null; }
  }).filter(x => x !== null);
  
  console.log(`Found ${records.length} valid records from your past messages.`);
  
  // Write to history.json so it works even without MongoDB
  fs.writeFileSync('history.json', JSON.stringify(records, null, 2));
  console.log("Saved to history.json");
  
  // Try connecting to MongoDB
  if (process.env.MONGO_URI) {
      try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        await Temperature.deleteMany({}); // clear old
        console.log("Cleared old records.");
        await Temperature.insertMany(records);
        console.log(`Successfully inserted ${records.length} records into MongoDB.`);
        mongoose.disconnect();
      } catch (err) {
        console.log("MongoDB not available or error:", err.message);
      }
  } else {
      console.log("No MONGO_URI in .env, skipping MongoDB insert.");
  }
}
run();
