import { Router } from "express";
import {ProductManagerMongo} from "../dao/mongoManagers/ProductMongoManager.js";

const router = Router();
const productManager = new ProductManagerMongo()

router.get("/", async (req,res)=> {
    const products = await productManager.getProducts()

    res.render("home",{products})
})

router.get("/chat", async (req,res)=>{
    res.render("chat")

})
router.get("/realtimeproducts", async (req,res)=>{

    res.render("realtimeproducts")
})
export default router;