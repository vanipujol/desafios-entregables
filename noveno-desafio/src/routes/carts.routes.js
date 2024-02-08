import { Router } from "express";
import CartController from "../controller/carts.controller.js";

const router = Router();

router.get('/', CartController.getCarts);
router.get('/:cid', CartController.getCartById);
router.post('/', CartController.createCart);
router.post('/:cid/product/:pid', CartController.addProductToCart);
router.delete('/:cid/products/:pid', CartController.removeProductFromCart);
router.put('/:cid', CartController.updateCart);
router.put('/:cid/products/:pid', CartController.updateProductQuantity);
router.delete('/:cid', CartController.removeAllProductsFromCart);

export { router as cartRouter };