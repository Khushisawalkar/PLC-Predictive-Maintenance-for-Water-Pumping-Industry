const fs = require('fs');
const axios = require('axios');

const rawData = fs.readFileSync('user_data.json', 'utf8');
const data = JSON.parse(rawData);

let currentIndex = 0;

function simulate() {
  if (data.length === 0) return;
  
  // Loop back to start if we reach the end
  if (currentIndex >= data.length) {
    currentIndex = 0;
  }

  const record = data[currentIndex];
  const temperature = record.temperature;
  const speed = record.rpm;
  const vibration = record.vibration;
  const current = record.current;

  axios.post('http://localhost:5000/api/temperature', {
    temperature: temperature,
    speed: speed,
    vibration: vibration,
    current: current
  }).then(() => {
    console.log(`Sent simulated dynamic data [${currentIndex + 1}/${data.length}]: Temp=${temperature}, Speed=${speed}, Vibration=${vibration}, Current=${current}`);
  }).catch(err => {
    console.error("Error sending simulated dynamic data:", err.message);
  });

  currentIndex++;
}

// Send data every 1 second to simulate live streaming
setInterval(simulate, 1000);
console.log("Simulating dynamic PLC data playback...");
simulate();
