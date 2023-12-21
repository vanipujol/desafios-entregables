import { Router } from "express";
import { ProductManagerFile } from "../managers/ProductManagerFile.js";

const path = "products.json";
const router = Router();
const productsManagerFile = new ProductManagerFile(path);

/**
 * Route to get a list of products.
 * @param {number} [limit] - The maximum number of products to return.
 */
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = limit ? await productsManagerFile.getProducts().then(data => data.slice(0, parseInt(limit))) : await productsManagerFile.getProducts();

        res.send({
            status: "success",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Internal server error',
        });
    }
});

/**
 * Route to get a product by ID.
 * @param {number} pid - The product ID.
 */
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productsManagerFile.getProductById(productId);

        if (product !== "Not found") {
            res.send({
                status: "success",
                product: product
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: "Product not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Internal server error',
        });
    }
});

/**
 * Route to add a new product.
 * @param {string} title - The title of the product.
 * @param {string} description - The description of the product.
 * @param {string} code - The product code.
 * @param {number} price - The product price.
 * @param {number} stock - The product stock.
 * @param {string} category - The product category.
 * @param {string[]} [thumbnails] - Array of image paths for product thumbnails.
 */
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Validation of input data types
        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof code !== 'string' ||
            typeof category !== 'string' ||
            typeof price !== 'number' ||
            typeof stock !== 'number'
        ) {
            return res.status(400).send({
                status: 'error',
                msg: 'Invalid data types for one or more fields',
            });
        }

        // Validation of thumbnails data type
        if (thumbnails && (!Array.isArray(thumbnails) || !thumbnails.every(thumbnail => typeof thumbnail === 'string'))) {
            return res.status(400).send({
                status: 'error',
                msg: 'Invalid data type for thumbnails',
            });
        }

        const product = { title, description, code, price, stock, category, thumbnails };

        productsManagerFile.addProduct(product)
            .then((products) => {
                res.status(201).send({
                    status: 'success',
                    msg: 'Product created',
                    products,
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    status: 'error',
                    msg: 'Internal server error',
                });
            });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Internal server error',
        });
    }
});

/**
 * Route to update a product by ID.
 * @param {number} pid - The product ID.
 */
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updateProduct = await productsManagerFile.updateProduct(pid, req.body);

        if (updateProduct)
            res.send({
                status: "success",
                product: updateProduct
            });
        else
            res.status(404).send("Product not found");
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Internal server error',
        });
    }
});

/**
 * Route to delete a product by ID.
 * @param {number} pid - The product ID.
 */
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const deleteProduct = await productsManagerFile.deleteProduct(pid);

        if (deleteProduct === "success")
            res.send({
                status: "success",
                msg: `Deleted product with id: ${pid}`
            });
        else
            res.status(404).send("Product not found");
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Internal server error',
        });
    }
});

export { router as productRouter };