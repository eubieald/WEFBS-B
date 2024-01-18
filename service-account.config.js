const fs = require('fs').promises;
const path = require('path');

const file = 'service-account.json';
const fileUrl = path.join(__dirname, file);

// Function to read and parse the JSON file
const getConfigData = async () => {
  try {
    const data = await fs.readFile(fileUrl, 'utf-8');
    const configData = JSON.parse(data);
    return configData;
  } catch (error) {
    console.error('Error reading config file:', error);
    throw error; // Propagate the error for handling elsewhere
  }
};

module.exports = getConfigData;
