import productsModel from "../models/products.model.js";

class ProductManagerMongo {
    /**
     * Retrieves all products from the database.
     * @returns {Promise<Array>} A promise that resolves to an array of products.
     */
    getProducts = async () => {
        const products = await productsModel.find().lean();
        console.log(products);
        return products;
    };

    /**
     * Adds a new product to the database.
     * @param {Object} product - The product to be added.
     * @returns {Promise<Object>} A promise that resolves to the created product.
     */
    addProduct = async (product) => {
        product.status = product.status ?? true;

        console.log(product);
        return await productsModel.create(product);
    };

    /**
     * Retrieves a product by its ID.
     * @param {string} id - The ID of the product to retrieve.
     * @returns {Promise<Object>} A promise that resolves to the retrieved product.
     */
    async getProductById(id) {
        return await productsModel.find({_id: id});
    }

    /**
     * Updates a product with new information.
     * @param {string} id - The ID of the product to update.
     * @param {Object} updatedProduct - The updated product information.
     * @returns {Promise<Object>} A promise that resolves to the updated product.
     */
    async updateProduct(id, updatedProduct) {
        return await productsModel.updateOne({_id: id}, {$set: updatedProduct});
    }

    /**
     * Deletes a product from the database.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise<string>} A promise that resolves to a success message.
     */
    async deleteProduct(id) {
        await productsModel.deleteOne({_id:id});
        return "success";
    }
}

export {ProductManagerMongo};
