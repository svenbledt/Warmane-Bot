/* global process */
require("colors");
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(process.cwd(), "terminal.log");

const writeToLog = (timeStamp, level, color, messages) => {
  try {
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(LOG_FILE, "utf-8");
    } catch (err) {
      console.error("Failed to read log file:", err);
    }

    const logMessage = [`[${timeStamp}]`.gray, `[${level}]`[color], messages.join(" ")];
    
    // Console output
    console.log(...logMessage);
    
    // File output
    fileContent += logMessage.join(" ") + "\n";
    fs.writeFileSync(LOG_FILE, fileContent, "utf-8");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
};

/**
 * @param {...string} message
 */
const info = (...message) => {
  writeToLog(new Date().toLocaleTimeString(), "Info", "blue", message);
};

/**
 * @param {...string} message
 */
const success = (...message) => {
  writeToLog(new Date().toLocaleTimeString(), "OK", "green", message);
};

/**
 * @param {...string} message
 */
const error = (...message) => {
  writeToLog(new Date().toLocaleTimeString(), "Error", "red", message);
};

/**
 * @param {...string} message
 */
const warn = (...message) => {
  writeToLog(new Date().toLocaleTimeString(), "Warning", "yellow", message);
};

module.exports = { info, success, error, warn };
