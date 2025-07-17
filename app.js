const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const sgMail = require("@sendgrid/mail");
const mongoStore = require("connect-mongodb-session")(session);
const nodemailer = require("nodemailer");
const multer = require("multer");

require("dotenv").config(); // To load environment variables from .env

sgMail.setApiKey(process.env.SEND_GRID_API);

module.exports.sendMail = async (email, subject, text, html = "") => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
        html, // Optional: allows sending HTML content
    };

    try {
        console.log(process.env.EMAIL_USER);
        const response = await sgMail.send(mailOptions);
        console.log("Email sent:", response[0].statusCode);
        console.log("Email sent successfully!");
        return { success: true };
    } catch (err) {
        console.log(err);
    }
};

const MONGODB_URI =
    "mongodb+srv://aung_myat:zz762389@nodejs.4lf0iqx.mongodb.net/shop?retryWrites=true&w=majority&appName=Nodejs";

const app = express();
const store = new mongoStore({
    uri: MONGODB_URI,
    collection: "session",
});

const csrfProtection = csrf();

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const User = require("./models/User");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(multer({ storage, fileFilter }).single("image"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
    session({
        secret: "test",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/admin", adminRoute);
app.use("/", shopRoute);
app.use("/", authRoute);
app.use("/", (req, res, next) => {
    res.render("error", {
        path: "/",
        isLoggedIn: req.session.isLoggedIn,
        title: "Page not found!",
        msg: "Cannot find the page with this url",
    });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(3000);
        console.log("Connected Sucessfully!");
    })
    .catch((err) => {
        console.log(err);
    });
