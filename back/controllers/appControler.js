const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
  
  const isUser = await User.findOne({ email: req.body.email });
  console.log(isUser);
  if (isUser) {
    return res.status(409).json({ message: 'User already exists' });
  } else {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        lastLogin: new Date().toUTCString(),
      });
      user
        .save()
        .then((result) => {
          console.log('User creation was succesful');
          res
            .status(200)
            .json({ message: 'Success! Please login to continue' });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(500).json({ message: 'User not found !' });
      return;
    }
    if (user.status === 'blocked') {
      res.status(500).json({ message: 'Blocked users cannot log in !' });
    } else {
      await user.updateOne({ lastLogin: new Date().toUTCString() });
      const password = await bcrypt.compare(req.body.password, user.password);
      if (password) {
        const token = jwt.sign(
          { email: user.email, userId: user._id },
          'secret',
          {
            expiresIn: '1h',
          }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: user._id,
          name: user.name,
        });
      } else {
        res.status(500).json({ message: 'Password incorrect' });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.send(JSON.stringify(users));
};

exports.blockUsers = async (req, res, next) => {
  let isBlockingHimself = false;
  try {
    const email = req.Userdata.email;
    const selectedUsers = req.body.selectedUsers;
    for (let person of selectedUsers) {
      let doc = await User.findOne({ email: person.email });
      doc.status = 'blocked';
      if (doc.email === email) {
        isBlockingHimself = true;
        console.log(true);
      }
      doc.save();
    }
    console.log('isBlocking' + isBlockingHimself);
    res.status(201).json({ message: 'blocked', isBlockingHimself });
  } catch (err) {
    console.log(err);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const selectedUsers = req.body.selectedUsers;
    for (let person of selectedUsers) {
      let doc = await User.findOne({ email: person.email });
      doc.status = 'active';
      doc.save();
      console.log(doc);
    }
    res.status(201).json({ message: 'active' });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  let isBlockingHimself = false;
  try {
    const email = req.Userdata.email;
    const selectedUsers = req.body.selectedUsers;
    for (let person of selectedUsers) {
      await User.deleteOne({ email: person.email });
      if (person.email === email) {
        isBlockingHimself = true;
        console.log(true);
      }
    }
    res.status(201).json({ message: 'deleted', isBlockingHimself});
  } catch (err) {
    console.log(err);
  }
};
