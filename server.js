const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Read data
app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({ masterRate: 70, records: {} });
  }
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });
    try {
      res.json(JSON.parse(data || '{}'));
    } catch (e) {
      res.json({ masterRate: 70, records: {} });
    }
  });
});

// Save data
app.post('/api/data', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save file' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});