import express from "express";
import {ProductManager} from "./ProductManager.js";

const PORT = 8080;
const app = express();

app.use(express.urlencoded({extended:true}))

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
})

const productManager = new ProductManager("./db.txt");

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = limit ? await productManager.getProducts().then(data => data.slice(0, parseInt(limit))) : await productManager.getProducts();

    res.json({ products });
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);

    const product = await productManager.getProductById(productId);

    if (!product || product === "Not found") {
        return res.send({
            error: 'El producto no existe'
        });
    }
    res.json({ product });
});