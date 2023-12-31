import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
const GoogleStrategy = passportGoogle.Strategy;
/**
 * Google strategy for authenticating
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile: any, done) => {
      try {
        let email = profile.emails[0].value;

        const user = await UserModel.findOne({ email });

        // If user doesn't exist creates a new user. (similar to sign up)
        if (!user) {
          const newUser = await UserModel.create({
            name: profile.displayName,
            email,
            password: await bcrypt.hash("1", 8)
            // we are using optional chaining because profile.emails may be undefined.
          });
          if (newUser) {
            done(null, newUser);
          }
        } else {
          done(null, user);
        }
      } catch (error) {
        done(null, false);
      }

    }
  )
);
