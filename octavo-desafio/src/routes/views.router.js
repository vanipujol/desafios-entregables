import { Router } from "express";
import {ProductManagerMongo} from "../dao/mongoManagers/ProductMongoManager.js";
import { CartManagerMongo } from "../dao/mongoManagers/CartMongoManager.js";

const router = Router();
const productManager = new ProductManagerMongo()
const cartManager = new CartManagerMongo()

const publicAccess = (req,res,next) =>{
    if(req.session.user){
        return res.redirect('/');
    }
    next();
}

const privateAccess = (req,res,next) =>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

/**
 * Route for rendering the registration page.
 * Accessible only to non-authenticated users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/register', publicAccess, (req,res)=>{
    res.render('register')
});

/**
 * Route for rendering the login page.
 * Accessible only to non-authenticated users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/login', publicAccess, (req,res)=>{
    res.render('login')
})

/**
 * Route for rendering the home page.
 * Accessible only to authenticated users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/',privateAccess, async (req, res) => {
    const products = await productManager.getProductsByHome()
    res.render('home', {products, user: req.session.user})
})

/**
 * GET endpoint to render the resetPassword page.
 *
 * @function
 * @name resetPasswordRoute
 * @memberof router
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.get("/resetPassword", (req,res)=>{
    res.render("resetPassword");
})

/**
 * Route to retrieve and render a paginated list of products.
 * @name GET /products
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Renders the 'products' view with the paginated list of products.
 */
router.get('/products', privateAccess, async (req, res) => {
    try {
        const { limit, page, sort, category, availability, query} = req.query

        // Get the paginated list of products
        const products = await productManager.getProducts(limit, page, sort, category, availability, query);

        // Render the products view with the obtained list

        res.render('products',  {products, user:req.session.user});
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Internal server error');
    }
});

/**
 * Route to retrieve and render details of a specific product by ID.
 * @name GET /products/:productId
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Renders the 'productDetails' view with details of the specified product.
 */
router.get('/products/:productId', privateAccess, async (req, res) => {
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
});

/**
 * Route to retrieve and render details of a specific shopping cart by ID.
 * @name GET /carts/:cartId
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Renders the 'carts' view with details of the specified shopping cart.
 */
router.get('/carts/:cartId', privateAccess, async (req, res) => {
    const { cartId } = req.params;

    try {
        const carts = await cartManager.getCartByIdJson(cartId);

        if (carts) {
            console.log(carts)
            res.render('carts', { cart: carts[0] } );
        } else {
            res.status(404).json({ error: `Cart with ID ${cartId} not found` });
        }
    } catch (error) {
        console.error('Error getting cart details:', error.message);
        res.status(500).send('Internal error server');
    }
});
router.get("/chat", async (req,res)=>{
    res.render("chat")

})
router.get("/realtimeproducts", async (req,res)=>{

    res.render("realtimeproducts")
})

export default router;