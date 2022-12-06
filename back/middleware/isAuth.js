const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (token !== null) {
      const decodedToken = jwt.verify(token, 'secret');
      req.Userdata = { email: decodedToken.email, userId: decodedToken.userId };
      next();
    } else {
  
      res.status(409).redirect('/auth')
    }
  } catch (err) {
    console.log(err);
  }
};
