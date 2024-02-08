import { Router } from "express";
import ViewsController from "../controller/views.controller.js";

const router = Router();

router.get('/register', ViewsController.publicAccess, ViewsController.renderRegister);

router.get('/login', ViewsController.publicAccess, ViewsController.renderLogin);

router.get('/', ViewsController.privateAccess, ViewsController.renderHome);

router.get("/resetPassword", ViewsController.renderResetPassword);

router.get('/products', ViewsController.privateAccess, ViewsController.renderProducts);

router.get('/products/:productId', ViewsController.privateAccess, ViewsController.renderProductDetails);

router.get('/carts/:cartId', ViewsController.privateAccess, ViewsController.renderCartDetails);

router.get("/chat", ViewsController.renderChat);

router.get("/realtimeproducts", ViewsController.renderRealtimeProducts);

export default router;
