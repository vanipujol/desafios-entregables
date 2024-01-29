import { Router } from "express";
import userModel from "../dao/models/users.model.js";
import {createHash, validatePassword} from "../utils.js";
import passport from "passport";

const router = Router();
router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
    async (req,res) => {
        res.send({status:"success", message:"Registered user"})
    })
router.get("/failregister", async (req,res)=>{
    console.log('Registration failure');
    res.send({error: 'Registration failure'})
})

router.post("/login", passport.authenticate("login", {failureRedirect: '/api/session/faillogin'}),
    async (req, res) => {
        if (!req.user) {
            return res.status(400).send({status: "error"})
        }

        const isValidPassword = validatePassword(req.body.password, req.user);

        if (!isValidPassword) {
            return res.status(400).send({
                status: "error",
                error: "Datos incorrectos"
            });
        }

        let role = "usuario";

        if (req.user.email === "adminCoder@coder.com") {
            role = "admin";
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: role
        };

        res.send({status: "success", payload: req.user})
    })

router.get("/faillogin", (req,res)=>{
    res.send({error:"Fail login"})
})

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect("/products")
});

router.get("/current", (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.send({ status: "success", user });
    } else {
        res.status(401).send({ status: "error", message: "Unauthenticated user" });
    }
});

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'Error logout'
            })
        }
        res.redirect('/login')
    })
})

router.post("/restartPassword", async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send(
        res.send({
            status:"error",
            message:"Incorrect data"
        })
    )
    const user = await userModel.findOne({email});
    if(!user) return res.status(400).send(
        res.send({
            status:"error",
            message:"Inexistent user"
        })
    )
    const newHashPassword = createHash(password);

    await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
    res.send({
        status:"success",
        message:"Modified password"
    })
})
export default router;