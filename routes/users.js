const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validators = require('../validation/validators');

const User = require('../models/User');

const checkJsonAndKey = (req, res, isJSON = false) => {
  if (!req.headers['x-api-key'] && !req.query['x-api-key']) {
    res
      .status(400)
      .send({ error: 'No api key detected in header or querystring' });
  }
  if (isJSON && !req.is('application/json')) {
    res.status(400).send({ error: 'Expecting application/json' });
  }
};

router.post('/newuser', (req, res) => {
  if (!req.headers['x-api-key'] && !req.query['x-api-key']) {
    res
      .status(400)
      .send({ error: 'No api key detected in header or querystring' });
  }
  if (!req.is('application/json')) {
    res.status(400).send({ error: 'Expecting application/json' });
  } else {
    const { username, name, password, email } = req.body;

    const { errors, valid } = validators.validateRegisterUser(req.body);

    if (!valid) {
      res.status(400).send(errors);
    } else {
      User.findOne({ username })
        .then(user => {
          if (user) {
            errors.username = 'A user with this username already exists';
            res.status(400).send(errors);
          } else {
            User.findOne({ email })
              .then(user => {
                if (user) {
                  errors.email = 'A user with this email already exists';
                  res.status(400).send(errors);
                } else {
                  // Create the new user object
                  const newUser = new User({
                    name,
                    username,
                    email,
                    password
                  });

                  // Generate a hashed password to store
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                        .save()
                        .then(() => {
                          const payload = {
                            id: newUser._id,
                            name: newUser.name,
                            username: newUser.username,
                            email: newUser.email
                          };
                          res.status(201).send(payload);
                        })
                        .catch(err => console.log(err));
                    });
                  });
                }
              })
              .catch(err => {
                console.log(err);
                res.send(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }
  }
});

router.get('/all', (req, res) => {
  checkJsonAndKey(req, res);
  User.find({}).then(customers => {
    const payload = {};
    payload.data = [];
    customers.forEach(customer => {
      payload.data.push({
        name: customer.name,
        username: customer.username,
        email: customer.email
      });
    });
    res.status(200).send(payload);
  });
});

router.get('/', (req, res) => {
  const errors = {};
  User.findOne({ username: req.query.user }).then(user => {
    if (!user) {
      User.findById(req.query.user)
        .then(user => {
          const payload = {
            data: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          };
          res.status(200).send(payload);
        })
        .catch(err => {
          errors.notFound = 'No user found with the given parameters';
          res.status(404).send(errors);
        });
    } else {
      const payload = {
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      };
      res.status(200).send(payload);
    }
  });
});

router.delete('/:id', (req, res) => {
  checkJsonAndKey(req, res);
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).send({ message: 'User Deleted' });
    })
    .catch(err => console.log(err));
});

module.exports = router;
