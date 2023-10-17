import passport from 'passport';
import passportLocal from 'passport-local';
import { UserModel } from '../models/user';
import bcrypt from 'bcrypt';

/**
 * Local strategy for authenticating
 */
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({
    passReqToCallback: true
},
    async function (req, username, password, done) {
        try {
            console.log("In the local strategy");
            const user = await UserModel.findOne({ email: username });
            

            if (!user) {
                // req.flash("error", "User not Found");
                return done(null, false);
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch)
                return done(null, user);
            else
                return done(null, false);
        } catch (error: any) {
            // req.flash("error", error);
            return done(error);
        }
    }
));