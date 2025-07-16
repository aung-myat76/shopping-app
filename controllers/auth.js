const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/User");

const { sendMail } = require("../app");

exports.getLogin = (req, res, next) => {
    console.log(req.flash("error_message"));
    res.render("auth/login", {
        path: "/login",
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    // User.findOne({ email: email }).then((user) => {
    //     if (!user) {
    //         req.flash("error_msg", "Your Email is wrong!");
    //         return res.redirect("/login");
    //     } else {
    //         bcrypt
    //             .compare(password, user.password)
    //             .then((doMatch) => {
    //                 if (!doMatch) {
    //                     req.flash("error_msg", "Your Password is wrong!");
    //                     return res.redirect("/login");
    //                 }
    if (!errors.isEmpty()) {
        req.flash("error_msg", errors.array()[0].msg);
        return res.redirect("/login");
    } else {
        return req.session.save((err) => {
            console.log(err);

            res.redirect("/");
        });
    }
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
    //     }
    // });
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password } = req.body;

    let errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        req.flash("error_msg", errors.array()[0].msg);
        return res.redirect("/signup");
    }

    // User.findOne({ email: email })
    //     .then((userDoc) => {
    //         if (userDoc) {
    //             req.flash(
    //                 "error_msg",
    //                 "This email have been used for sign up!"
    //             );
    //             return res.redirect("/signup");
    //         }
    //         if (password.length < 6) {
    //             req.flash(
    //                 "error_msg",
    //                 "Your password must be at least 6 characters!"
    //             );
    //             return res.redirect("/signup");
    //         } else if (password !== confirmedPassword) {
    //             req.flash("error_msg", "Your passwords must be equal!");
    //             return res.redirect("/signup");
    //         } else {
    return bcrypt.hash(password, 12).then((hashPsw) => {
        const user = new User({
            email: email,
            password: hashPsw,
            cart: { products: [], totalPrice: 0 },
        });

        return user.save().then((result) => {
            res.redirect("/login");
        });
    });
};
// })
// .catch((err) => {
//     console.log(err);
// });
// };

exports.postLogout = (req, res, next) => {
    if (confirm("Are you sure to logout?")) {
        req.session.destroy((err) => {
            console.log(err);
            res.redirect("/");
        });
    }
};
