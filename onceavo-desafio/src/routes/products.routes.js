import { Router } from "express";
import ProductController from "../controller/products.controller.js";
import {checkRole} from "../middlewares/auth.js";

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:pid', ProductController.getProductById);
router.post('/', checkRole(["admin"]), ProductController.addProduct);
router.put('/:pid', checkRole(["admin"]), ProductController.updateProduct);
router.delete('/:pid', checkRole(["admin"]), ProductController.deleteProduct);


export { router as productRouter };