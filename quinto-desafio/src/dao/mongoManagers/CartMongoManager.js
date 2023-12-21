import cartsModel from "../models/carts.model.js";
import {ProductManagerMongo} from "./ProductMongoManager.js";

const productsManager = new ProductManagerMongo();

class CartManagerMongo {
    /**
     * Retrieves all carts from the database.
     * @returns {Promise<Array>} A promise that resolves to an array of carts.
     */
    getCarts = async () => {
        return await cartsModel.find();
    };

    /**
     * Adds a new cart to the database.
     * @param {Object} product - The product to be added to the new cart.
     * @returns {Promise<Object>} A promise that resolves to the created cart.
     */
    addCart = async (product) => {
        const payload = { "products": [product]}
        console.log(payload);
        return await cartsModel.create(payload);
    };

    /**
     * Retrieves a cart by its ID.
     * @param {string} id - The ID of the cart to retrieve.
     * @returns {Promise<Object>} A promise that resolves to the retrieved cart.
     */
    async getCartById(id) {
        return await cartsModel.find({_id: id});
    }

    /**
     * Adds a product to a cart with a specified quantity.
     * @param {string} cartId - The ID of the cart.
     * @param {string} productId - The ID of the product to add to the cart.
     * @param {number} quantity - The quantity of the product to add.
     * @returns {Promise<Object|boolean>} A promise that resolves to the updated cart or false if an error occurs.
     */
    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                return false;
            }

            const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

            if (existingProductIndex === -1){
                cart.products.push({ id: productId, quantity: quantity });
            } else {
                cart.products[existingProductIndex].quantity += quantity;
            }

            return await cartsModel.findByIdAndUpdate(cartId, cart);
        } catch (error) {
            console.error('Error: ', error);
            return false;
        }
    }
}

export {CartManagerMongo};
