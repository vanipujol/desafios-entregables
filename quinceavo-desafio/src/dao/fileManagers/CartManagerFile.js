import fs from "fs";
import path from "path";
import __dirname from "../utils.js";
import { ProductManagerFile } from "./ProductManagerFile.js";

const productsManagerFile = new ProductManagerFile( "products.json");
class CartManagerFile {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    /**
     * Retrieves a list of carts from the file.
     * @returns {Promise<Array>} A promise resolving to an array of carts.
     */
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error: ', error);
            return [];
        }
    };

    /**
     * Adds a new cart to the file.
     * @param {Array} [product] - Array of products to be added to the cart.
     * @returns {Promise<Array>} A promise resolving to an updated array of carts.
     */
    addCart = async (product) => {
        try {
            const carts = await this.getCarts();
            let generatedId;

            if (carts.length === 0) {
                generatedId = 1;
            } else {
                generatedId = carts[carts.length - 1].id + 1;
            }

            const newCart = {
                id: generatedId,
                products: product || []
            };

            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return carts;
        } catch (error) {
            console.error('Error: ', error);
            return [];
        }
    };

    /**
     * Retrieves a cart by its ID.
     * @param {number} id - The ID of the cart.
     * @returns {Promise<Object|string>} A promise resolving to the found cart or "Not found".
     */
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((p) => p.id === id);

            if (cart) {
                return cart;
            } else {
                return "Not found";
            }
        } catch (error) {
            console.error('Error: ', error);
            return "Not found";
        }
    }

    /**
     * Adds a product to a cart.
     * @param {number} cartId - The ID of the cart.
     * @param {number} productId - The ID of the product to add.
     * @param {number} quantity - The quantity of the product to add.
     * @returns {Promise<boolean>} A promise resolving to true if the product is added successfully, otherwise false.
     */
    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                return false;
            }

            const existingProductIndex = carts[cartIndex].products.findIndex(product => product.id === productId);

            if (existingProductIndex === -1) {
                // Add new product to cart
                const product = await productsManagerFile.getProductById(productId);

                if (product === "Not found") {
                    return false; // Product not found
                }

                carts[cartIndex].products.push({ id: productId, quantity: quantity });
            } else {
                // Increase quantity of existing product
                if(carts[cartIndex].products[existingProductIndex].quantity){
                    carts[cartIndex].products[existingProductIndex].quantity += quantity;
                }else{
                    carts[cartIndex].products[existingProductIndex].quantity = quantity;
                }

            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return true;
        } catch (error) {
            console.error('Error: ', error);
            return false;
        }
    }
}

export { CartManagerFile };