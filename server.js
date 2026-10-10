const express = require('express');
const cors = require('cors');
const path = require('path');
const solveHandler = require('./api/solve');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.all('/api/solve', (req, res) => {
  return solveHandler(req, res);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 YouTest.me Quiz Solver running at http://localhost:${PORT}`);
});
