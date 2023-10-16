import express from 'express';
import { UserModel } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/mailer';
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

export function getResetPageController(req: express.Request, res: express.Response) {
    res.render("resetPassword", {
        title: "Reset Password",
    });
}

export async function resetPasswordController(req: express.Request, res: express.Response) {
    try {
        if (req.body.password === req.body["confirm-password"]) {
            if (req.body.password?.length < 8) {
                req.flash('error', 'Password should have at least 8 letters');
                return res.redirect("back");
            }
            if (res.locals.user?.name) {
                const user: any = await UserModel.findById(res.locals.user.id);
                user.password = await bcrypt.hash(req.body.password, 8);
                user.save();
                req.flash('success', 'You password reset successfully');
                return res.redirect("/");
            }
            const { id, token } = req.params;

            const user: any = await UserModel.findById(id);
            const jwtSecret = (process.env.SECRETE ? process.env.SECRETE : "secret") + user?.password;
            if (user) {
                const decoded = jwt.verify(token, jwtSecret);
                console.log("****** ", decoded, " This is decoded");
                user.password = await bcrypt.hash(req.body.password, 8);
                user.save();
                req.flash('success', 'You password reset successfully log in again');
                return res.redirect("/api/auth/login");
            } else {
                req.flash('error', 'Please Enter a valid email');
                return res.redirect("back");
            }
        } else {
            req.flash('error', 'password and confirm password are not matching');
            return res.redirect("back");
        }
    } catch (error) {
        req.flash('error', 'Reset password failed');
        return res.redirect("back");
    }

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
            req.body.password = await bcrypt.hash(req.body.password, 8);
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

export async function sendEmailToResetPassword(req: express.Request, res: express.Response) {
    const email = req.body?.email;
    try {
        const user: any = await UserModel.findOne({ email });
        const jwtSecret = (process.env.SECRETE ? process.env.SECRETE : "secret") + user.password;
        if (user) {
            const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: "15m" });
            const link = `http://localhost:8081/api/auth/reset-email/${user.id}/${token}`;
            console.log(link);
            const templateData = { resetLink: link };

            res.render("resetPasswordEmailTemplate", templateData, async (err, html) => {
                if (err) {
                    console.error('Error rendering template:', err);
                    req.flash('error', 'Failed to send reset link to email address');
                    return res.redirect("back");
                } else {
                    const userEmail = process.env.USER_EMAIL || "";
                    await sendMail(userEmail, 'Reset Password', html);
                    req.flash('success', 'Reset link sent to email address');
                    return res.redirect("back");
                }
            });
        } else {
            req.flash('error', 'Failed to send email link');
            return res.redirect("back");
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Failed to send email link');
        return res.redirect("back");
    }

}

export async function resetPasswordWithToken(req: express.Request, res: express.Response) {
    const { id, token } = req.params;


    try {
        const user: any = await UserModel.findById(id);
        const jwtSecret = (process.env.SECRETE ? process.env.SECRETE : "secret") + user?.password;
        if (user) {
            const decoded = jwt.verify(token, jwtSecret);
            console.log("****** ", decoded, " This is decoded");
            return res.render("resetPassword");
        } else {
            req.flash('error', 'Please Enter a valid email');
            return res.redirect("/api/auth/forgot-password");
        }
    } catch (error) {
        req.flash('error', 'Please Enter a valid email');
        return res.redirect("/api/auth/forgot-password");
    }

}