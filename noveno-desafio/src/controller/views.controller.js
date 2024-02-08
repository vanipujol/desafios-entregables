import { ProductManagerMongo } from "../dao/mongoManagers/ProductMongoManager.js";
import { CartManagerMongo } from "../dao/mongoManagers/CartMongoManager.js";

export default class ViewsController {
    static publicAccess(req, res, next) {
        if (req.session.user) {
            return res.redirect('/');
        }
        next();
    }

    static privateAccess(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        next();
    }
    static async renderRegister(req, res) {
        res.render('register');
    }

    static async renderLogin(req, res) {
        res.render('login');
    }

    static async renderHome(req, res) {
        const productManager = new ProductManagerMongo();
        const products = await productManager.getProductsByHome();
        res.render('home', { products, user: req.session.user });
    }

    static async renderResetPassword(req, res) {
        res.render('resetPassword');
    }

    static async renderProducts(req, res) {
        try {
            const productManager = new ProductManagerMongo();
            const { limit, page, sort, category, availability, query } = req.query;
            const products = await productManager.getProducts(limit, page, sort, category, availability, query);
            res.render('products', { products, user: req.session.user });
        } catch (error) {
            console.error('Error fetching products:', error.message);
            res.status(500).send('Internal server error');
        }
    }

    static async renderProductDetails(req, res) {
        const productManager = new ProductManagerMongo();
        const { productId } = req.params;

        try {
            const product = await productManager.getProductById(productId);

            if (product) {
                const productData = JSON.parse(JSON.stringify(product));
                res.render('productDetails', { product: productData[0] });
            } else {
                res.status(404).json({ error: `Product with ID ${productId} not found` });
            }
        } catch (error) {
            console.error('Error getting product details:', error.message);
            res.status(500).send('Internal server error');
        }
    }

    static async renderCartDetails(req, res) {
        const cartManager = new CartManagerMongo();
        const { cartId } = req.params;

        try {
            const carts = await cartManager.getCartByIdJson(cartId);

            if (carts) {
                console.log(carts);
                res.render('carts', { cart: carts[0] });
            } else {
                res.status(404).json({ error: `Cart with ID ${cartId} not found` });
            }
        } catch (error) {
            console.error('Error getting cart details:', error.message);
            res.status(500).send('Internal error server');
        }
    }

    static renderChat(req, res) {
        res.render('chat');
    }

    static renderRealtimeProducts(req, res) {
        res.render('realtimeproducts');
    }
}
