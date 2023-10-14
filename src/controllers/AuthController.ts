import express from 'express';
import { UserModel } from '../models/user';
export function userSignInController(req: express.Request, res: express.Response) {
    return res.render("login", {
        title: "Users Sign In",
    });
}

export function userSignUpController(req: express.Request, res: express.Response) {
    res.render("signup", {
        title: "Users sign Up",
    });
}

export function userForgotPasswordController(req: express.Request, res: express.Response) {
    res.render("forgotPassword", {
        title: "Forgot Password",
    });
}

export function userSignOutController(req: express.Request, res: express.Response) {
    req.logOut({ keepSessionInfo: false }, (err) => {
        console.log(err);
        req.flash('success', 'You logged out');
        return res.redirect("/api/auth/login");
    });
}

export async function userCreateController(req: express.Request, res: express.Response) {
    if (req.body.password === req.body["confirm-password"]) {
        if (req.body.password?.length < 8) {
            req.flash('error', 'Password should have at least 8 letters');
            return res.redirect("back");
        }
        const user = await UserModel.find({
            email: req.body.email
        });

        if (user.length === 0) {
            await UserModel.create(req.body);
            req.flash('success', 'You Signed up successfully');
            return res.redirect("/api/auth/login");
        } else {
            req.flash('error', 'You Signed up failed');
            return res.redirect("back");
        }
    } else {
        req.flash('error', 'password and confirm password are not matching');
        return res.redirect("back");
    }
}