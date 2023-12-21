import { Router } from "express";
import { CartManagerFile } from "../managers/CartManagerFile.js";

const path = "carts.json";
const router = Router();
const cartManagerFile = new CartManagerFile(path);

/**
 * Route to get a list of carts.
 */
router.get('/', async (req, res) => {
    try {
        const carts = await cartManagerFile.getCarts();

        res.send({
            status: "success",
            carts: carts
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
 * Route to get a cart by ID.
 * @param {number} cid - The cart ID.
 */
router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const carts = await cartManagerFile.getCartById(cid);

        if (carts !== "Not found") {
            res.send({
                status: "success",
                product: carts
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: "Cart not found"
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
 * Route to create a new cart.
 * @param {Array} products - Array of products to be added to the cart.
 */
router.post('/', async (req, res) => {
    try {
        const { products } = req.body;

        await cartManagerFile.addCart(products);

        res.status(201).send({
            status: 'success',
            msg: 'Cart created',
            products,
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
 * Route to add a product to a cart.
 * @param {number} cid - The cart ID.
 * @param {number} pid - The product ID.
 * @param {number} [quantity=1] - The quantity of the product to be added (default is 1).
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const productToCart = await cartManagerFile.addProductToCart(cid, pid, quantity);

        const carts = await cartManagerFile.getCartById(cid);

        if (productToCart) {
            res.status(201).send({
                status: "success",
                msg: 'Product added successfully',
                carts
            });
        } else {
            res.status(401).send({
                status: "error",
                msg: 'Error adding product'
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

export { router as cartRouter };