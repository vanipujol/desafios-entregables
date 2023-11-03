class ProductManager {
    /**
     * Constructor for the ProductManager class.
     * Initializes the products array.
     */
    constructor() {
        this.products = [];
    }

    /**
     * Adds a new product to the products array.
     * @param {Object} product - The product to be added.
     * @returns {string} - A message indicating the result of the operation.
     */
    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios");
            return "Todos los campos son obligatorios";
        }

        if (this.products.some((existingProduct) => existingProduct.code === product.code)) {
            console.error("Ya existe un producto con el mismo código");
            return "Ya existe un producto con el mismo código";
        }

        let id = (this.getProducts()).length;
        product.id =  ++id;
        this.products.push(product);
    }

    /**
     * Retrieves the list of products.
     * @returns {Array} - An array of products.
     */
    getProducts() {
        return this.products;
    }

    /**
     * Gets a product by its unique identifier (id).
     * @param {number} id - The id of the product to retrieve.
     * @returns {Object|string} - The product with the specified id or a message indicating it was not found.
     */
    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (product) {
            return product;
        } else {
            return "Not found";
        }
    }
}


const manager = new ProductManager();

console.log(manager.getProducts());

manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
});

console.log(manager.getProducts());

manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
});

console.log(manager.getProductById(1));

console.log(manager.getProductById(99));
