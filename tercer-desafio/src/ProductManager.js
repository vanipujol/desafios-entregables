import fs from 'fs';

export class ProductManager {
    /**
     * Creates an instance of ProductManager.
     * @param {string} path - The path to the file storing product data.
     */
    constructor(path) {
        this.path = path;
    }

    /**
     * Adds a new product to the product list.
     * @param {Object} product - The product object to be added.
     * @returns {Promise<string>} A promise resolving to a success or error message.
     */
    async addProduct(product) {

        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios")
            return "Todos los campos son obligatorios";
        }

        const products = await this.getProducts()

        if (products.length !== 0)
            if (products.some((existingProduct) => existingProduct.code === product.code)) {
                console.error("Producto existente con el mismo código")
                return "Producto existente con el mismo código";
            }

        let id = (await this.getProducts()).length;
        product.id =  ++id;
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    /**
     * Retrieves the list of products from the file.
     * @returns {Promise<Array>} A promise resolving to an array of products.
     */
    async getProducts() {
        if (!fs.existsSync(this.path)) {
            return [];
        }

        const products = await fs.promises.readFile(this.path, 'utf-8');
        try {
            const data = JSON.parse(products);

            return Array.isArray(data) ? data : [data];
        } catch (error) {
            console.error('Error al parsear el JSON:', error.message);
            return [];
        }
    }

    /**
     * Retrieves a product by its ID.
     * @param {number} id - The ID of the product to retrieve.
     * @returns {Promise<Object|string>} A promise resolving to the product object or an error message if not found.
     */
    async getProductById(id) {

        const products = await this.getProducts()
        const product = products.find((p) => p.id === id);
        if (product) {
            return product;
        }else {
            return "Not found"
        }
    }

    /**
     * Updates an existing product.
     * @param {number} id - The ID of the product to update.
     * @param {Object} updatedProduct - The updated product object.
     * @returns {Promise<string>} A promise resolving to a success or error message.
     */
    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index !== -1) {
            updatedProduct.id = id;
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return "Producto modificado exitosamente";
        } else {
            return "Producto no encontrado";
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
            return "Producto eliminado exitosamente";
        } else {
            return "Producto inexistente";
        }
    }
}

/**
 * The main function demonstrating the usage of the ProductManager class.
 * @returns {Promise<void>} A promise resolving once the main function completes.
 */
async function main()
{
    const client = new ProductManager("./db.txt")

    console.log(await client.getProducts())

    await client.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    })

    console.log(await client.getProducts())

    await client.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    })

    console.log(await client.getProductById(1))

    console.log(await client.getProductById(99))

    await client.updateProduct(1,{
        title:"producto actualizado",
        description: "descripcion del producto actualizado",
        price:400,
        thumbnail: "sin imagen",
        code: "zxy 321",
        stock: 4
    });

    console.log(await client.getProducts());


}
main()