const fs = require('fs');

try {
  const userData = JSON.parse(fs.readFileSync('user_data.json', 'utf8'));
  const validData = userData.filter(d => d.rpm > 0 || d.current > 0);
  
  const historyData = validData.slice(0, 100).map(d => ({
    temperature: d.temperature,
    speed: d.rpm,
    vibration: d.vibration,
    current: d.current,
    createdAt: new Date().toISOString()
  }));

  fs.writeFileSync('history.json', JSON.stringify(historyData, null, 2));
  console.log('Successfully seeded history.json with user_data.json');
} catch (e) {
  console.error('Error seeding history:', e);
}
