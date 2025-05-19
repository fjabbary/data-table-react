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

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  users.push(newUser);
  console.log(users);
  res.status(201).json(newUser);
}
);

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  console.log(userId)
  
  const userIndex = users.findIndex(user => user.id == userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  console.log(users.length)
  users.splice(userIndex, 1);
  console.log(users.length)
  res.status(204).send();
}
);

app.listen(port, host, () => {
  console.log(`[ ready ] Server running in ${nodeEnv} mode at http://${host}:${port}`);
});