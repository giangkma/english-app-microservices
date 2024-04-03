const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Authentication with JWT
exports.jwtAuthentication = async (req, res, next) => {
  try {
    res.locals.isAuth = false;

    const isTokenEmpty =
      (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session);

    if (isTokenEmpty) {
      return next();
    }

    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      // Read the ID Token from the Authorization header.
      token = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
      // Read the ID Token from cookie.
      token = req.cookies.__session;
    } else {
      return next();
    }

    // if not exist cookie[access_token] -> isAuth = false -> next
    if (!token) {
      return next();
    }

    // verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      let user = await UserModel.findOne({ accountId }).select(
        '-_id username name avt favoriteList coin',
      );

      if (user) {
        user.accountId = accountId;
        res.locals.isAuth = true;
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Authentication with JWT ERROR: ', error);
    return res.status(401).json({
      message: 'Unauthorized.',
      error,
    });
  }
};
