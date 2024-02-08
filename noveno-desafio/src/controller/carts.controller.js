import { CartManagerMongo } from "../dao/mongoManagers/CartMongoManager.js";

const CartManager = new CartManagerMongo();

class CartController {
    static async getCarts(req, res) {
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
    }

    static async getCartById(req, res) {
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
    }

    static async createCart(req, res) {
        try {
            console.log(req.body);
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
    }
    static async addProductToCart(req, res) {
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
    }

    static async removeProductFromCart(req, res) {
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
    }

    static async updateCart(req, res) {
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
    }

    static async updateProductQuantity(req, res) {
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
    }

    static async removeAllProductsFromCart(req, res) {
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
    }
}
export default CartController;
