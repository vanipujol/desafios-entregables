import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import {createHash, validatePassword} from "../utils.js";
import userModel from "../dao/models/users.model.js";

const LocalStrategy = local.Strategy;

const inicializePassport = () => {

    passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {

                let user = await userModel.findOne({email: username});
                if (user) {
                    console.log('User already registered');
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done(error)
            }

        }));

    passport.use("login", new LocalStrategy(
        {usernameField: "email"},
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username})
                if (!user) {
                    return done(null, false);
                }
                if (!validatePassword(password, user)) {
                    return done(null, false);
                }
                return done(null, user)
            } catch (error) {
                return done(error);
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id).populate("cart");
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.f417e35954ad029e",
        clientSecret: "1a8a5e2c2cbd3fdde1f90e83ac55b0532c064a07",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const first_name = profile._json.name
            let email;
            if (!profile._json.email) {
                email = profile.username;
            }

            let user = await userModel.findOne({email: profile._json.email});
            if (user) {
                console.log('User already registered');
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name: '',
                email,
                age: 18,
                password: '',
                role: "usuario"
            }
            const result = await userModel.create(newUser);
            return done(null, result);

        } catch (error) {
            return done(error)
        }

    }))
}

export default inicializePassport;