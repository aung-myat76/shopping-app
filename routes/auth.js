const express = require("express");
const { body, check } = require("express-validator");
const bcrypt = require("bcryptjs");

const authControlller = require("../controllers/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/login", authControlller.getLogin);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Your email is incorrect")
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (!user) {
                        return Promise.reject(
                            "Your email hasn't signed up yet"
                        );
                    }
                });
            }),
        body("password", "Your password is incorrect")
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ email: req.body.email }).then((user) => {
                    if (!user) {
                        return Promise.reject(
                            "No account found with this email"
                        );
                    }

                    return bcrypt
                        .compare(value, user.password)
                        .then((doMatch) => {
                            if (!doMatch) {
                                return Promise.reject(
                                    "Your password is incorrect"
                                );
                            }

                            req.session.isLoggedIn = true;
                            req.session.user = user;
                        });
                });
            }),
    ],
    authControlller.postLogin
);

router.get("/signup", authControlller.getSignup);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Your email is incorrect")
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject(
                            "Your email had been used for sign up"
                        );
                    }
                });
            }),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Your password must be at least 6 characters long")
            .trim(),
        body("confirmedPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Your passwords must be match");
                }

                return true;
            }),
    ],
    authControlller.postSignup
);

router.post("/logout", authControlller.postLogout);

module.exports = router;
