const express = require("express");
const router = express.Router();
const authHelper = require("../helpers/login-helper");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", (req, res) => {
  authHelper
    .doSignup(req.body)
    .then((response) => {
      delete response.password;
      var token = jwt.sign(response, process.env.JWT_AUTH, {
        expiresIn: "60d",
      });
      res.cookie("userToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2592000000),
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "none",
      });
      res.sendStatus(200);
    })
    .catch((error) => {
      if (error.code === 500) {
        res.sendStatus(500);
      } else {
        res.status(403).json({ error: error.msg });
      }
    });
});

router.post("/login", (req, res) => {
  authHelper
    .doLogin(req.body)
    .then((response) => {
      delete response.password;
      var token = jwt.sign(response, process.env.JWT_AUTH, {
        expiresIn: "60d",
      });
      res.cookie("userToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2592000000),
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "none",
      });
      res.sendStatus(200);
    })
    .catch((error) => {
      if (error.code === 500) {
        res.sendStatus(500);
      } else {
        res.status(403).json({ error: error.msg });
      }
    });
});

router.get("/check", (req, res) => {
if (req.query.username) {
  authHelper
  .checkUsername(req.query.username)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    if (error.code === 500) {
      res.sendStatus(500);
    } else {
      res.status(403).json({ error: error.msg });
    }
  });
} else {
  res.sendStatus(400)
}
});

module.exports = router;
