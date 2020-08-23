const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = ((req, res) => {
  User.find({})
    .then((users) => {
      if (!users.length) {
        res.status(404).send({ message: 'Пользователи отсутствуют' });
        return;
      }
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
});

module.exports.getUserId = ((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user.length) {
        res.status(404).send({ message: 'Нет такого пользователя' });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => {
      res.status(404).send({ message: 'Невалидные данные' });
    });
});

module.exports.createUser = ((req, res) => {
  // const {
  //   email, password, name, about, avatar,
  // } = req.body;
  bcrypt.hash(req.body.password, 10)

    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })

        .then((user) => {
          res.send({ data: user });
        });
    })
    .catch(() => {
      res.status(500).send({ message: 'Невалидные данные' });
    });
});

module.exports.login = ((req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
});
