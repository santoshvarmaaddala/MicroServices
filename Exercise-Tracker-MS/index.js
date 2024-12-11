const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = [];
const exercises = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.post('/api/users', (req, res) => {
  const uniqueID = crypto.randomBytes(16).toString('hex');
  const userName = req.body.username;


  users.push({ username: userName, _id: uniqueID });

  res.json({
    username: userName,
    _id: uniqueID
  });
});


app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;


    const user = users.find(user => user._id === _id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const exerciseDate = date ? new Date(date).toDateString() : new Date().toDateString();

   
    exercises.push({
      _id,
      username: user.username,
      description,
      duration: Number(duration),
      date: exerciseDate
    });


    res.json({
      username: user.username,
      description,
      duration: Number(duration),
      date: exerciseDate,
      _id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;


  const user = users.find(user => user._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }


  let userExercises = exercises.filter(exercise => exercise._id === _id);


  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(exercise => new Date(exercise.date) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(exercise => new Date(exercise.date) <= toDate);
  }

  
  if (limit) {
    userExercises = userExercises.slice(0, Number(limit));
  }

  
  res.json({
    username: user.username,
    count: userExercises.length,
    _id,
    log: userExercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date
    }))
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
