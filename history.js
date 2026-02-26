const fs = require('fs');

const HISTORY_FILE = process.env.HISTORY_FILE || './request-history.jsonl';

const saveRequest = (req, res, payload) => {
  const record = {
    timestamp: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection?.remoteAddress,
    status: res.statusCode,
    payload,
  };

  const line = JSON.stringify(record) + '\n';

  fs.appendFile(HISTORY_FILE, line, (err) => {
    if (err) {
      console.error('Failed to save request history:', err);
    }
  });
};

const getHistory = (limit = 100) => {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    const content = fs.readFileSync(HISTORY_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.slice(-limit).map((line) => JSON.parse(line));
  } catch {
    return [];
  }
};

module.exports = { saveRequest, getHistory };
