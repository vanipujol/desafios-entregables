import productsModel from "../models/products.model.js";

class ProductManagerMongo {

    /**
     * Retrieves a paginated list of products based on specified filters and options.
     * @param {number} limit - The maximum number of products per page.
     * @param {number} page - The page number to retrieve.
     * @param {string} sort - The sorting order for products (either "asc" or "desc").
     * @param {string} category - The category of products to filter.
     * @param {boolean} availability - Filter products based on availability (true for available products).
     * @param {string} query - The search query to filter products by title.
     * @returns {Promise<Object>} An object containing the paginated list of products and pagination links.
     */
    getProducts = async (limit, page, sort, category, availability, query) => {

        if (page && (isNaN(page) || page <= 0)) {
            return {
                status: "error",
                msg: "Page not found"
            };
        }

        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (availability) {
            filter.stock = { $gt: 0 };
        }

        if (query) {
            filter.$or = [
                { title: { $regex: new RegExp(query, 'i') } },
            ];
        }

        const options = {
            limit: limit ?? 10,
            page: page ?? 1,
            sort: { price: sort === "asc" ? 1 : -1},
            lean: true
        }

        const products = await productsModel.paginate(filter, options);

        const queryParams = {
            limit,
            page: products.hasPrevPage && products.prevPage,
            sort,
            category,
            availability,
            query
        };

        // Remove properties undefined of the link
        Object.keys(queryParams).forEach(key => queryParams[key] === undefined && delete queryParams[key]);

        const baseLink = '/products';

        let prevLink = null
        let nextLink = null
        if (products.hasPrevPage) {
            prevLink = `${baseLink}?${new URLSearchParams(queryParams).toString()}`;
        }

        if (products.hasNextPage) {
            queryParams.page = products.nextPage;
            nextLink = `${baseLink}?${new URLSearchParams(queryParams).toString()}`;
        }

        products.prevLink = prevLink
        products.nextLink = nextLink
        return {
            status: "success",
            msg: products
        }
    };

    /**
     * Retrieves all products from the database.
     * @returns {Promise<Array>} A promise that resolves to an array of products.
     */
    getProductsByHome = async () => {
        return await productsModel.find().lean();
    };


    /**
     * Adds a new product to the database.
     * @param {Object} product - The product to be added.
     * @returns {Promise<Object>} A promise that resolves to the created product.
     */
    addProduct = async (product) => {
        product.status = product.status ?? true;

        return await productsModel.create(product);
    };

    /**
     * Retrieves a product by its ID from the database.
     * @param {string} id - The ID of the product to be retrieved.
     * @returns {Promise<Array>} Array containing the product matching the specified ID.
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

    async isInStock(amount, id){
        const product = await this.getProductById(id);

        return parseInt(amount) <= product[0].stock;
    }
}

export {ProductManagerMongo};
