const jwt = require("jsonwebtoken");

const { secret } = require("../config/auth");
const db = require("../models");
// const model = db.model;

exampleMiddlewareFunction = (req, res, next) => {
  // do something
  console.log(req.headers);

  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (token == null) {
    res.status(401).send({
      success: false,
      message: "Invalid token",
      statusCode: 401,
    });
  }

  jwt.verify(token, secret, (err, data) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: "Invalid token",
        statusCode: 401,
      });
    }

    console.log("token", data);

    // Khusus refactor-me-2 (jika user ID tidak sama)
    if (req.body.userId)
      if (data.id !== req.body.userId) {
        res.status(401).send({
          success: false,
          message: "Action not allowed",
          statusCode: 401,
        });
      }

    res.data = data;
    next();
  });
};

const verify = {
  exampleMiddlewareFunction: exampleMiddlewareFunction,
};

module.exports = verify;
