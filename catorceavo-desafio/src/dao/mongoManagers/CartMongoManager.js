import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

class CartManagerMongo {

    /**
     * Retrieves all carts from the database.
     * @returns {Promise<Array>} Array of carts.
     */
    getCarts = async () => {
        return await cartsModel.find();
    };

    /**
     * Creates a new cart in the database.
     * @param {Object} body - The cart details to be created.
     * @returns {Promise<Object>} The newly created cart.
     */
    createCart = async body => {
        const payload = { "products": [body]}
        return await cartsModel.create(payload);
    };

    /**
     * Retrieves a cart by its ID.
     * @param {string} id - The ID of the cart.
     * @returns {Promise<Array>} Array containing the cart.
     */
    async getCartById(id) {
        return await cartsModel.find({_id: id});
    }

    /**
     * Retrieves a cart by its ID in JSON format.
     * @param {string} id - The ID of the cart.
     * @returns {Promise<Object>} The cart in JSON format.
     */
    async getCartByIdJson(id) {
        return await cartsModel.find({_id: id}).lean();
    }

    /**
     * Adds a product to a cart with the specified quantity.
     * @param {string} cartId - The ID of the cart.
     * @param {string} productId - The ID of the product to be added.
     * @param {number} quantity - The quantity of the product to be added.
     * @returns {Promise<Object>} The updated cart.
     */
    async addProductToCart(cartId, productId, quantity) {
        const cart = await cartsModel.findOne({_id:cartId});
        if (!cart){
            return {
                status: "error",
                msg: `El carrito con el id ${cartId} no existe`
            }
        }
        const product = await productsModel.findOne({_id:productId});
        if (!product){
            return {
                status: "error",
                msg: `El producto con el id ${productId} no existe`
            }
        }

        let productsToCart = cart.products;

        const indexProduct = productsToCart.findIndex((product)=> product._id.toString() === productId )

        if(indexProduct === -1){
            const newProduct = {
                product: productId,
                quantity: quantity
            }
            cart.products.push(newProduct);
        }else{
            cart.products[indexProduct].quantity += quantity;
        }

        await cart.save();

        return cart;
    }

    /**
     * Removes a product from the cart.
     * @param {string} cartId - The ID of the cart.
     * @param {string} productId - The ID of the product to be removed.
     * @returns {Promise<Object|null>} The updated cart or null if the cart does not exist.
     */
    async removeProductFromCart(cartId, productId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = cart.products.filter((product) => product.product.toString() !== productId);

        await cart.save();

        return cart;
    }

    /**
     * Updates the products of a cart with new product details.
     * @param {string} cartId - The ID of the cart to be updated.
     * @param {Array} products - The new array of products to replace existing ones.
     * @returns {Promise<Object|null>} The updated cart or null if the cart does not exist.
     */
    async updateCart(cartId, products) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = products;
        await cart.save();

        return cart;
    }

    /**
     * Updates the quantity of a specific product in a cart.
     * @param {string} cartId - The ID of the cart containing the product.
     * @param {string} productId - The ID of the product to be updated.
     * @param {number} quantity - The new quantity of the product.
     * @returns {Promise<Object|null>} The updated cart or null if the cart or product does not exist.
     */
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        const productIndex = cart.products.findIndex((product) => product.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
        }

        return cart;
    }

    /**
     * Removes all products from a cart, leaving it empty.
     * @param {string} cartId - The ID of the cart to be updated.
     * @returns {Promise<Object|null>} The updated cart or null if the cart does not exist.
     */
    async removeAllProductsFromCart(cartId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = [];
        await cart.save();

        return cart;
    }
}

export {CartManagerMongo};
