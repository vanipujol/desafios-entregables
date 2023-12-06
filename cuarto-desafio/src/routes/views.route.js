import { Router } from "express";
import {ProductManagerFile} from "../managers/ProductManagerFile.js";

const router = Router();
const path = '../files/products.json'
const productManagerFile = new ProductManagerFile(path)

router.get("/", async (req,res)=>{
   const products = await productManagerFile.getProducts()

    console.log(products)
    res.render("home",{products})
})

router.get("/realtimeproducts", async (req,res)=>{

    res.render("realtimeproducts")
})

export default router;