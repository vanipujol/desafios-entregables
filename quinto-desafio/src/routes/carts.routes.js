import { Router } from "express";
import { CartManagerMongo } from "../dao/mongoManagers/CartMongoManager.js";

const router = Router();
const CartManager = new CartManagerMongo();

/**
 * Handles requests to retrieve all carts.
 */
router.get('/', async (req, res) => {
    try {
        const carts = await CartManager.getCarts();

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
 * Handles requests to retrieve a specific cart by its ID.
 * @param {string} cid - The ID of the cart to retrieve.
 */
router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const carts = await CartManager.getCartById(cid);

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
 * Handles requests to create a new cart.
 * @param {Object} req.body - The body of the request containing cart information.
 */
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const cart = await CartManager.addCart(req.body);

        res.status(201).send({
            status: 'success',
            msg: 'Cart created',
            cart,
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
 * Handles requests to add a product to a specific cart.
 * @param {string} cid - The ID of the cart to add the product to.
 * @param {string} pid - The ID of the product to add to the cart.
 * @param {number} req.body.quantity - The quantity of the product to add (default is 1).
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const quantity = req.body.quantity || 1;

        const productToCart = await CartManager.addProductToCart(cid, pid, quantity);

        const carts = await CartManager.getCartById(cid);

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
