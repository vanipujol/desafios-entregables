/**
 * Module dependencies.
 * @typedef {import("express")} express
 * @typedef {import("./ProductManager.js").ProductManager} ProductManager
 */

import express from "express";
import {ProductManager} from "./ProductManager.js";

const PORT = 8080;
const app = express();

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({extended:true}))

/**
 * Start the server.
 */
app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
})

/**
 * Create an instance of ProductManager.
 * @type {ProductManager}
 */
const productManager = new ProductManager("./db.txt");

/**
 * Endpoint to get a list of products.
 * @name GET /products
 * @function
 * @memberof app
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the products are fetched and the response is sent.
 */
app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = limit ? await productManager.getProducts().then(data => data.slice(0, parseInt(limit))) : await productManager.getProducts();

    res.json({ products });
});

/**
 * Endpoint to get a product by its ID.
 * @name GET /products/:pid
 * @function
 * @memberof app
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the product is fetched and the response is sent.
 */
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