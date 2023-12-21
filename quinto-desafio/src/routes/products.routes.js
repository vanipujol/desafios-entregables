import { Router } from "express";
import { ProductManagerMongo } from "../dao/mongoManagers/ProductMongoManager.js";

const router = Router();
const productsManager = new ProductManagerMongo();

/**
 * Handles requests to retrieve all products.
 * @param {number} req.query.limit - The maximum number of products to retrieve (optional).
 */
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = limit ? await productsManager.getProducts().then(data => data.slice(0, parseInt(limit))) : await productsManager.getProducts();

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
 * Handles requests to retrieve a specific product by its ID.
 * @param {string} pid - The ID of the product to retrieve.
 */
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        console.log(productId)
        const product = await productsManager.getProductById(productId);

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
 * Handles requests to create a new product.
 * @param {Object} req.body - The body of the request containing product information.
 * @param {string} req.body.title - The title of the product.
 * @param {string} req.body.description - The description of the product.
 * @param {string} req.body.code - The code of the product.
 * @param {number} req.body.price - The price of the product.
 * @param {number} req.body.stock - The stock quantity of the product.
 * @param {string} req.body.category - The category of the product.
 * @param {Array<string>} req.body.thumbnails - An array of thumbnail URLs for the product.
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

        productsManager.addProduct(product)
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
 * Handles requests to update a product by its ID.
 * @param {string} pid - The ID of the product to update.
 * @param {Object} req.body - The updated product information.
 */
router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updateProduct = await productsManager.updateProduct(pid, req.body);

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
 * Handles requests to delete a product by its ID.
 * @param {string} pid - The ID of the product to delete.
 */
router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const deleteProduct = await productsManager.deleteProduct(pid);

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
