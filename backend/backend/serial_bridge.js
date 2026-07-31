const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// Adjust this port to match your Arduino's COM port!
const COM_PORT = process.env.COM_PORT || 'COM3';
const BAUD_RATE = 115200;

console.log(`Starting Serial Bridge on ${COM_PORT} at ${BAUD_RATE} baud...`);

const port = new SerialPort({
  path: COM_PORT,
  baudRate: BAUD_RATE,
  autoOpen: false
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  console.log(`Port ${COM_PORT} opened successfully.`);
});

let jsonBuffer = "";
let recordingJson = false;

parser.on('data', async (data) => {
  const line = data.trim();
  console.log(`[Serial]: ${line}`);

  if (line === "{") {
    recordingJson = true;
    jsonBuffer = "{";
  } else if (recordingJson) {
    jsonBuffer += line;
    if (line === "}") {
      recordingJson = false;
      try {
        const payload = JSON.parse(jsonBuffer);
        console.log("Parsed Arduino Data:", payload);
        
        // Map to what the backend expects
        const apiPayload = {
          temperature: payload.temperature,
          speed: payload.rpm, // map rpm to speed
          vibration: payload.vibration,
          current: payload.current
        };

        await axios.post('http://localhost:5000/api/temperature', apiPayload);
      } catch (e) {
        console.error("Error parsing JSON or posting to backend:", e.message, "\nBuffer:", jsonBuffer);
      }
      jsonBuffer = "";
    }
  }
});

port.on('error', function(err) {
  console.log('Serial Port Error: ', err.message);
});
