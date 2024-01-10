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
        const cart = await CartManager.createCart(req.body);

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
 * Handles the addition of a product to a cart.
 *
 * @param {string} req.params.cid - The cart ID.
 * @param {string} req.params.pid - The product ID.
 * @param {Object} req.body - The request body containing the product quantity.
 * @param {number} req.body.quantity - The quantity of the product to be added to the cart.
 * @returns {Object} - Response object indicating the success or failure of the operation.
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const quantity = req.body.quantity;

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


/**
 * @route DELETE /carts/:cid/products/:pid
 * @description Remove a product from the cart.
 * @param {string} cid - Cart ID.
 * @param {string} pid - Product ID.
 */
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await CartManager.removeProductFromCart(cid, pid);

        if (cart) {
            res.send({
                status: "success",
                msg: 'Product removed from cart successfully',
                cart
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: 'Product or cart not found'
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
 * @route PUT /carts/:cid
 * @description Update the entire cart.
 * @param {string} cid - Cart ID.
 * @param {Array} req.body.products - Array of products to update the cart with.
 */
router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const updatedCart = await CartManager.updateCart(cid, req.body.products);

        res.send({
            status: "success",
            msg: 'Cart updated successfully',
            cart: updatedCart
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
 * @route PUT /carts/:cid/products/:pid
 * @description Update the quantity of a product in the cart.
 * @param {string} cid - Cart ID.
 * @param {string} pid - Product ID.
 * @param {number} req.body.quantity - New quantity of the product.
 */
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const updatedCart = await CartManager.updateProductQuantity(cid, pid, quantity);

        if (updatedCart) {
            res.send({
                status: "success",
                msg: 'Product quantity updated successfully',
                cart: updatedCart
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: 'Product or cart not found'
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
 * @route DELETE /carts/:cid
 * @description Remove all products from the cart.
 * @param {string} cid - Cart ID.
 */
router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await CartManager.removeAllProductsFromCart(cid);

        if (cart) {
            res.send({
                status: "success",
                msg: 'All products removed from cart successfully',
                cart
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: 'Cart not found'
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
