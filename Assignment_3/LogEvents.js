const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const fs = require('fs'); // Use the regular fs module for existsSync
const fsp = require('fs').promises; // Use fs.promises for async functions
const path = require('path');

const LogEvents = async (message) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  const logDir = path.join(__dirname, 'Logs');
  const logFile = path.join(logDir, 'eventLogs.txt');

  try {
    // Check if the directory exists with fs.existsSync (sync function)
    if (!fs.existsSync(logDir)) {
      await fsp.mkdir(logDir);
    }

    // Append logItem to eventLogs.txt
    await fsp.appendFile(logFile, logItem);
    console.log('Log appended to file.');
  } catch (err) {
    console.error(err);
  }
};

module.exports = LogEvents;
