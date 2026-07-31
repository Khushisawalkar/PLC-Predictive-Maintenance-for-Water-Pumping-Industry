const fs = require('fs');

const rawDataFile = "C:\\Users\\khush\\.gemini\\antigravity-ide\\brain\\f3884efb-cc19-4aca-9807-76f8b1f36355\\scratch\\raw_data2.txt";
const rawStr = fs.readFileSync(rawDataFile, 'utf8');

// The raw data is like { ... } \n { ... } 
// We want to wrap it in [ ] and add commas
const jsonArrayStr = '[' + rawStr.replace(/}\s*\{/g, '},{') + ']';

const records = JSON.parse(jsonArrayStr);

const mappedRecords = records.map(obj => ({
  temperature: obj.temperature,
  speed: obj.rpm,
  vibration: obj.vibration,
  current: obj.current
}));

fs.writeFileSync('history.json', JSON.stringify(mappedRecords, null, 2));
console.log(`Saved ${mappedRecords.length} records to history.json`);
