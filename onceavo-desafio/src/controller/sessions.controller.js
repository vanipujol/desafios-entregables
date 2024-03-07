import userModel from "../dao/models/users.model.js";
import {createHash, validatePassword} from "../utils.js";
import {options} from "../config/config.js";
import {userService} from "../repository/index.repository.js";

class SessionsController {
    static async register(req, res) {
        res.send({status: "success", message: "Registered user"});
    }

    static async failRegister(req, res) {
        req.logger.error('Registration failure');
        res.send({error: 'Registration failure'});
    }
    static async login(req, res) {
        if (!req.user) {
            return res.status(400).send({status: "error"});
        }

        const isValidPassword = validatePassword(req.body.password, req.user);

        if (!isValidPassword) {
            return res.status(400).send({
                status: "error",
                error: "Datos incorrectos"
            });
        }

        let role = "user";

        if (req.user.email === options.ADMIN_EMAIL && req.body.password === options.ADMIN_PASSWORD) {
            role = "admin";
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: role
        };

        res.send({status: "success", payload: req.user});
    }

    static async failLogin(req, res) {
        res.send({error: "Fail login"});
    }

    static async githubCallback(req, res) {
    }

    static async githubCallbackRedirect(req, res) {
        req.session.user = req.user;
        res.redirect("/products");
    }

    static async current(req, res) {
        if (req.isAuthenticated()) {
            try {
                const userInfoDto = await userService.get(req.user);

                res.send({ status: "success", user: userInfoDto });
            } catch (error) {
                req.logger.error("Could not get user data");
                res.status(500).send({ status: "error", message: "Internal Server Error" });
            }
        } else {
            res.status(401).send({ status: "error", message: "Unauthenticated user" });
        }
    }


    static async logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    error: 'Error logout'
                });
            }
            res.redirect('/login');
        });
    }

    static async restartPassword(req, res) {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).send({
            status: "error",
            message: "Incorrect data"
        });

        const user = await userModel.findOne({email});
        if (!user) return res.status(400).send({
            status: "error",
            message: "Inexistent user"
        });

        const newHashPassword = createHash(password);

        await userModel.updateOne({_id: user._id}, {$set: {password: newHashPassword}});
        res.send({
            status: "success",
            message: "Modified password"
        });
    }
}
export default SessionsController;