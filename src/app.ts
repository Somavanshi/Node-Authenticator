import express from 'express';
import "./secrets";
import path from 'path';
// import { router } from './routes';
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from 'passport';
import passportLocal from 'passport-local';
import "./config/passport-google";
import "./config/mongoose";
import expressEjsLayout from 'express-ejs-layouts';
import { db } from './config/mongoose';
import { UserModel } from './models/user';
import { AuthRouter } from './routes/auth';
import "./config/passport-local";
import { addAuthenticated } from './utils/isAuthenticated';
// import { userSessionController } from './controllers/Users';
// import { UserModel } from './models/UserModel';
// import { addAuthenticated } from './utils/isAuthenticated';
import flash from 'connect-flash';
import { flashHandler } from './config/middleware';

const app = express();

app.use(session({
    name: "codial",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 1000
    },
    store: new MongoStore({
        mongoUrl: process.env.MONGO_LOCAL || "mongodb://localhost/node_auth_development",
        autoRemove: 'disabled'
    })
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'assets')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressEjsLayout);
app.set('layout extractStyles', true);
app.set("layout extractScripts", true);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: any, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
app.use(addAuthenticated);

app.use(flash());
app.use(flashHandler);

app.get("/", (req, res) => {
    return res.render("home");
});

app.use('/api/auth', AuthRouter);

app.listen(8081, () => {
    console.log('listening on port 8081');
});