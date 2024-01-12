import { Router } from "express";
import userModel from "../dao/models/users.model.js";

const router = Router();
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await userModel.findOne({ email });

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send({
            status: "error",
            error: "Todos los campos son obligatorios",
        });
    }

    if (exists) {
        return res.status(400).send({
            status: "error",
            error: "El usuario ya existe",
        });
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
    };

    let result = await userModel.create(user);
    res.send({
        status: "success",
        message: "Usuario registrado",
    });
});

router.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email,password});
  
    if(!user){
       return res.status(400).send({
            status:"error",
            error:"Datos incorrectos"
        })
    }

    let role = "usuario";

    if (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") {
        role = "admin";
    }

    req.session.user = {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: role
    }
    res.send({
        status:"success",
        payload: req.session.user,
        message:"Mi primer login!"
    })
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'No se pudo desloguear'
            })
        }
        res.redirect('/login')
    })
})

export default router;