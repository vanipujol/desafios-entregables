import { ProductManagerMongo } from "../dao/mongoManagers/ProductMongoManager.js";

class ProductController {
    static productsManager = new ProductManagerMongo();

    static async getProducts(req, res) {
        try {
            const { limit, page, sort, category, availability, query } = req.query;
            const products = await ProductController.productsManager.getProducts(limit, page, sort, category, availability, query);
            res.send({
                status: "success",
                products: products
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: 'error',
                msg: 'Internal server error',
            });
        }
    }

    static async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await ProductController.productsManager.getProductById(productId);

            if (product !== "Not found") {
                res.send({
                    status: "success",
                    product: product
                });
            } else {
                res.status(404).send({
                    status: "error",
                    msg: "Product not found"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: 'error',
                msg: 'Internal server error',
            });
        }
    }

    static async addProduct(req, res) {
        const newProduct = req.body;

        try {
            const createdProduct = await ProductController.productsManager.addProduct(newProduct);
            res.json(createdProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            const pid = req.params.pid;
            const updateProduct = await ProductController.productsManager.updateProduct(pid, req.body);

            if (updateProduct)
                res.send({
                    status: "success",
                    product: updateProduct
                });
            else
                res.status(404).send("Product not found");
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: 'error',
                msg: 'Internal server error',
            });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;
            const deleteProduct = await ProductController.productsManager.deleteProduct(pid);

            if (deleteProduct === "success")
                res.send({
                    status: "success",
                    msg: `Deleted product with id: ${pid}`
                });
            else
                res.status(404).send("Product not found");
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: 'error',
                msg: 'Internal server error',
            });
        }
    }
}
export default ProductController;