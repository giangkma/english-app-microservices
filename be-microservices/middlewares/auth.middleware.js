const jwt = require("jsonwebtoken");
const { publishAccountEvent } = require("../utils/publish-events");

// Authentication with JWT
exports.jwtAuthentication = async (req, res, next) => {
  try {
    res.locals.isAuth = false;

    const isTokenEmpty =
      (!req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")) &&
      !(req.cookies && req.cookies.__session);

    if (isTokenEmpty) {
      return next();
    }

    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      // Read the ID Token from the Authorization header.
      token = req.headers.authorization.split("Bearer ")[1];
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
      const user = await publishAccountEvent({
        event: "GET_USER_INFO_BY_ACCOUNT_ID",
        data: {
          accountId,
        },
      });
      console.log(user);

      if (user) {
        user.accountId = accountId;
        res.locals.isAuth = true;
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error("Authentication with JWT ERROR: ", error);
    return res.status(401).json({
      message: "Unauthorized.",
      error,
    });
  }
};
