import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import {createHash, validatePassword} from "../utils.js";
import userModel from "../dao/models/users.model.js";
import usersModel from "../dao/models/users.model.js";
import cartsModel from "../dao/models/carts.model.js";
import {options} from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {

                let user = await userModel.findOne({email: username});
                if (user) {
                    console.log('User already registered');
                    return done(null, false);
                }

                const newCart = new cartsModel({ products: [] });
                await newCart.save();

                console.log('New Cart:', newCart);

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    cart: newCart._id,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done(error);
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
        let user = await userModel.findById(id).populate("cart");
        done(null, user);
    });


    passport.use('github', new GitHubStrategy({
        clientID: options.CLIENT_ID,
        clientSecret: options.CLIENT_SECRET,
        callbackURL: options.CALLBACK_URL
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

export default initializePassport;