const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const users = require('./data/users');

// Get environment variables with fallbacks
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const nodeEnv = process.env.NODE_ENV ?? 'development';

dotenv.config();
app.use(cors())
app.use(express.json());


app.get('/', (_req, res) => {
  res.send({
    message: `Hello API`,
    environment: nodeEnv,
    server: `${host}:${port}`
  });
});

// Users API endpoint
app.get('/api/users', (_req, res) => {
  res.json(users);
});

app.listen(port, host, () => {
  console.log(`[ ready ] Server running in ${nodeEnv} mode at http://${host}:${port}`);
});