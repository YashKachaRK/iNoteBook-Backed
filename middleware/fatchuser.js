const jwt = require('jsonwebtoken');

const JWT_SECRET = "YashKacha@#786";

const fatchuser = (req, res, next) => {

  // GET TOKEN in header
  const token = req.header("auth-token");
  // match thay chhe ha k na
  if (!token) {
    return res.status(401).json({
      error: "Please authenticate using valid token"
    });
  }

  try {

    // VERIFY TOKEN j  tokken malse e verify thase
    const data = jwt.verify(token, JWT_SECRET);
//Store token user data inside request
    req.user = data.user;
    
    next();

  } catch (error) {

    return res.status(401).json({
      error: "Please authenticate using valid token"
    });

  }
};

module.exports = fatchuser;