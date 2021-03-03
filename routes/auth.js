const express = require("express");
const router = express.Router();
const loginHelper = require("../helpers/login-helper");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", (req, res) => {
  loginHelper
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
  loginHelper
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

module.exports = router;
