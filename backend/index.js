const express = require('express');
const cors = require('cors');
const users = require('./data/users');

const app = express();

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/', (_req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/api/users', (_req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  users.push(newUser);
  res.status(201).json(newUser);
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(user => user.id == userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = app;