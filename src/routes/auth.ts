import express from 'express';
import { getResetPageController, resetPasswordController, resetPasswordWithToken, sendEmailToResetPassword, userCreateController, userForgotPasswordController, userSignInController, userSignOutController, userSignUpController } from '../controllers/AuthController';
import passport from 'passport';
import { checkAuthenticated, checkLoggedIn } from '../utils/isAuthenticated';

export const AuthRouter = express.Router();

AuthRouter.get("/login", checkLoggedIn, userSignInController);
AuthRouter.get("/sign-up", checkLoggedIn, userSignUpController);
AuthRouter.get("/sign-out", userSignOutController);
AuthRouter.get("/forgot-password", checkLoggedIn, userForgotPasswordController);
AuthRouter.post("/forgot-password", sendEmailToResetPassword);

AuthRouter.post('/login',
    passport.authenticate('local', { failureRedirect: '/api/auth/login' }),
    function (req, res) {
        req.flash('success', 'User signed in successfully');
        return res.redirect('/api/auth/reset-password');
    });
AuthRouter.post("/sign-up", userCreateController);

AuthRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

AuthRouter.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    return res.redirect('/api/auth/reset-password');
});


AuthRouter.get("/reset-password", checkAuthenticated, getResetPageController);
AuthRouter.post("/reset-password", checkAuthenticated, resetPasswordController);

AuthRouter.get("/reset-email/:id/:token", resetPasswordWithToken);
AuthRouter.post("/reset-email/:id/:token", resetPasswordController);