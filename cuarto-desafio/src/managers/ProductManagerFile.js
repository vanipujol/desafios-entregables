import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class ProductManagerFile {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    /**
     * Retrieves a list of products from the file.
     * @returns {Promise<Array>} A promise resolving to an array of products.
     */
    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    };

    /**
     * Adds a new product to the file.
     * @param {Object} product - The product to be added.
     * @returns {Promise<Array>} A promise resolving to an updated array of products.
     */
    addProduct = async (product) => {
        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        product.status = product.status ?? true;

        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products;
    };

    /**
     * Retrieves a product by its ID.
     * @param {number} id - The ID of the product.
     * @returns {Promise<Object|string>} A promise resolving to the found product or "Not found".
     */
    async getProductById(id) {

        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            return "Not found";
        }
    }

    /**
     * Updates a product by its ID.
     * @param {number} id - The ID of the product to update.
     * @param {Object} updatedProduct - The updated product data.
     * @returns {Promise<Object|undefined>} A promise resolving to the updated product or undefined if not found.
     */
    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index !== -1) {
            updatedProduct.id = id;
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return updatedProduct;
        } else {
            return undefined;
        }
    }

    /**
     * Deletes a product by its ID.
     * @param {number} id - The ID of the product to delete.
     * @returns {Promise<string>} A promise resolving to a success or error message.
     */
    async deleteProduct(id) {
        const products = await this.getProducts();

        const updatedProducts = products.filter((p) => p.id !== id);

        if (products.length !== updatedProducts.length) {
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
            return updatedProducts;
        } else {
            return "Not found";
        }
    }
}

export {ProductManagerFile};