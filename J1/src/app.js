const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: process.env.JSON_LIMIT || '64kb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
