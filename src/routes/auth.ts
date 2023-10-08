import express from 'express';
import { userCreateController, userForgotPasswordController, userSignInController, userSignOutController, userSignUpController } from '../controllers/AuthController';
import passport from 'passport';
import { checkAuthenticated } from '../utils/isAuthenticated';

export const AuthRouter = express.Router();

AuthRouter.get("/login", userSignInController);
AuthRouter.get("/sign-up", userSignUpController);
AuthRouter.get("/sign-out", userSignOutController);
AuthRouter.get("/forgot-password", checkAuthenticated, userForgotPasswordController);

AuthRouter.post('/login',
    passport.authenticate('local', { failureRedirect: '/api/auth/login' }),
    function (req, res) {
        // req.flash('success', 'User signed in successfully');
        return res.redirect('/api/auth/forgot-password');
    });
AuthRouter.post("/sign-up", userCreateController);