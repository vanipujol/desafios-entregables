import { Router } from "express";
import { ProductManagerMongo } from "../dao/mongoManagers/ProductMongoManager.js";

const router = Router();
const productsManager = new ProductManagerMongo();

/**
 * @route GET /products
 * @description Get a list of products based on query parameters.
 * @param {number} req.query.limit - The maximum number of products to return.
 * @param {number} req.query.page - The page number of the product list.
 * @param {string} req.query.sort - The sorting criteria for the products.
 * @param {string} req.query.category - The category of products to filter.
 * @param {boolean} req.query.availability - Filter products based on availability.
 * @param {string} req.query.query - Search query for products.
 */
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, category, availability, query} = req.query

        const products = await productsManager.getProducts(limit, page, sort, category, availability, query)
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
 * @route POST /products
 * @description Add a new product.
 * @param {Object} req.body - The new product data.
 * @param {string} req.body.name - The name of the new product.
 * @param {string} req.body.description - The description of the new product.
 * @param {number} req.body.price - The price of the new product.
 * @param {string} req.body.category - The category of the new product.
 * @param {boolean} req.body.availability - The availability status of the new product.
 */
router.post('/', async (req, res) => {
    const newProduct = req.body;

    try {
        const createdProduct = await productsManager.addProduct(newProduct);
        res.json(createdProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
