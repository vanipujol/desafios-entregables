import {productService} from "../repository/index.repository.js";
import productErrorOptions from "../services/productError.js";
import {ERRORS} from "../enums/error.js";
import {CustomError} from "../services/customError.services.js";

class ProductController {

    static async getProducts(req, res) {
        try {
            const { limit, page, sort, category, availability, query } = req.query;
            const products = await productService.getProducts(limit, page, sort, category, availability, query);
            if (!products) {
                CustomError.createError({
                    name: "Could not get products",
                    cause: productErrorOptions.generateGetProductsError(),
                    message: "Error searching for products",
                    errorCode: ERRORS.PRODUCT_ERROR
                });
            }
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
            const product = await productService.getProductById(productId);

            if (typeof product === "string") {
                CustomError.createError({
                    name: "No se logro obtener el producto",
                    cause: productErrorOptions.generateGetProductByIdError(productId),
                    message: product,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }
            res.send({
                status: "success",
                message: product
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async addProduct(req, res) {
        try {
            const createdProduct = await productService.addProduct(req.body);
            if (typeof createdProduct === "string") {
                CustomError.createError({
                    name: "No se logro agregar el producto",
                    cause: productErrorOptions.generateAddProductError(),
                    message: createdProduct,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }
            res.send({
                status: "success",
                message: createdProduct
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async updateProduct(req, res) {
        try {
            const pid = req.params.pid;
            const updateProduct = await productService.updateProduct(pid, req.body);

            if (typeof updateProduct === "string") {
                CustomError.createError({
                    name: "Could not update the product",
                    cause: productErrorOptions.generateUpdateProductError(pid),
                    message: updateProduct,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }
            res.send({
                status: "success",
                message: `The product with the id was successfully modified: ${pid}`
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;
            const deleteProduct = await productService.deleteProduct(pid);

            if (deleteProduct === "success") {
                res.send({
                    status: "success",
                    msg: `Deleted product with id: ${pid}`
                });
            } else {
                CustomError.createError({
                    name: "DeleteProductError",
                    cause: productErrorOptions.generateDeleteProductError(pid),
                    message: "Unable to delete product",
                    errorCode: ERRORS.PRODUCT_ERROR
                });
            }
        } catch (error) {
            console.error(error);
            if (error.name === "DeleteProductError") {
                res.status(400).send({
                    status: 'error',
                    msg: error.message,
                    error: error
                });
            } else {
                res.status(404).send("Product not found");
            }
        }
    }
}
export default ProductController;