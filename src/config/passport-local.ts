import passport from 'passport';
import passportLocal from 'passport-local';
import { UserModel } from '../models/user';

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({
    passReqToCallback: true
},
    async function (req, username, password, done) {
        try {
            console.log("In the local strategy");
            const user = await UserModel.findOne({ email: username, password: password });

            if (!user) {
                // req.flash("error", "User not Found");
                return done(null, false);
            }

            return done(null, user);
        } catch (error: any) {
            // req.flash("error", error);
            return done(error);
        }
    }
));