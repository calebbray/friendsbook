const express = require('express');
const path = require('path');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const users = require('./routes/users');

app.get('/', (req, res) => {
  res.send('hello');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', users);

app.listen(config.PORT, () => {
  mongoose.set('useFindAndModify', false);
  mongoose
    .connect(
      config.MONGODB_URI,
      { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
  console.log(`Server running on port ${config.PORT}`);
});
