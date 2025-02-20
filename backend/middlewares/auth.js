const jwt = require("jsonwebtoken");
const SECRET_KEY = "secret";

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(token);
  if (!token) return res.status(401).json({ error: "Access denied" });

  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access restricted to admins" });
    }
    next();
  });
};

exports.verifyLoggedUser = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    const list = ["admin", "medic", "patient"];
    if (!list.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access restricted to logged users" });
    }
    next();
  });
};
