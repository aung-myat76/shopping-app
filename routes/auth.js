const express = require("express");

const authControlller = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControlller.getLogin);

router.post("/login", authControlller.postLogin);

router.get("/signup", authControlller.getSignup);

router.post("/signup", authControlller.postSignup);

router.post("/logout", authControlller.postLogout);

module.exports = router;
