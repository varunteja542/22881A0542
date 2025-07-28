const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'requests.log');

function logMiddleware(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms - ${ip}\n`;
    
    fs.appendFile(logFilePath, log, err => {
      if (err) console.error('Error writing log:', err);
    });
  });

  next();
}

module.exports = logMiddleware;
