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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      console.log(req.body);
      res.status(500).send({ message: 'Невалидные данные' });
    });
});
