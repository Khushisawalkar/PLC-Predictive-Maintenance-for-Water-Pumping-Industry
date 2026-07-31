const fs = require('fs');

const rawData = fs.readFileSync('user_data.json', 'utf8');
const data = JSON.parse(rawData);

function getMode(arr, ignoreZero = false) {
  const counts = {};
  let maxCount = 0;
  let mode = arr[0];
  for (let num of arr) {
    if (ignoreZero && num === 0) continue;
    counts[num] = (counts[num] || 0) + 1;
    if (counts[num] > maxCount) {
      maxCount = counts[num];
      mode = num;
    }
  }
  return mode;
}

const vibrations = data.map(d => d.vibration);
const temperatures = data.map(d => d.temperature);
const rpms = data.map(d => d.rpm);
const currents = data.map(d => d.current);

const modeVib = getMode(vibrations);
const modeTemp = getMode(temperatures);
const modeRpm = getMode(rpms);
const modeCurrent = getMode(currents);

const modeRpmNonZero = getMode(rpms, true);
const modeCurrentNonZero = getMode(currents, true);

console.log(`Modes (All): Temp=${modeTemp}, Speed=${modeRpm}, Vibration=${modeVib}, Current=${modeCurrent}`);
console.log(`Modes (Non-Zero): Speed=${modeRpmNonZero}, Current=${modeCurrentNonZero}`);

