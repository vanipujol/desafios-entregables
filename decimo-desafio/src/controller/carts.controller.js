import {cartService, ticketService} from "../repository/index.repository.js";
import {emailSender} from "../utils.js";
import {CustomError} from "../services/customError.services.js";
import ticketErrorOptions from "../services/ticketError.js";
import {ERRORS} from "../enums/error.js";
import {generateSendEmailError} from "../services/emailSenderError.js";
class CartController {
    static async getCarts(req, res) {
        try {
            const carts = await cartService.getCarts();
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
            const carts = await cartService.getCartById(cid);

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
            const cart = await cartService.createCart(req.body);

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

            const productToCart = await cartService.addProductToCart(cid, pid, quantity);

            const carts = await cartService.getCartById(cid);

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

            const cart = await cartService.removeProductFromCart(cid, pid);

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
            const updatedCart = await cartService.updateCart(cid, req.body.products);

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

            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);

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

    static purchase = async (req, res) => {
        try {
            const cartId = req.params.cid;

            const result = await ticketService.createTicket(cartId);

            if (!result) {
                CustomError.createError({
                    name: " The ticket could not be created",
                    cause: ticketErrorOptions.generateCreateTicketError(),
                    message: "The purchase was not successful",
                    errorCode: ERRORS.TICKET_ERROR
                })
            }

            const respond = await emailSender(req.session.user.email);

            if (!respond) {
                CustomError.createError({
                    name: "Error sending email",
                    cause: generateSendEmailError(req.session.user.email),
                    message: "The purchase was made successfully, but the email could not be sent",
                    errorCode: ERRORS.EMAIL_SENDER_ERROR
                })
            }

            const carts = await cartService.getCartById(cartId);

            for (const product of carts[0].products) {

                for (const m of result.notStock) {

                    if (product.product._id.toString() !== m.id){
                        await cartService.removeProductFromCart(cartId, product.product._id);
                    }

                }
            }

            res.send({
                status: "success",
                payload: result
            })

        } catch (error) {
            console.error(error);
            console.log(error.message);
        }
    }

    static async removeAllProductsFromCart(req, res) {
        try {
            const cid = req.params.cid;

            const cart = await cartService.removeAllProductsFromCart(cid);

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