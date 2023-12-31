import mongoose from "mongoose";

const collection = "carts";

const productSchemaCart  = new mongoose.Schema({
    productId: String,
    quantity: Number,
    _id: false
})

const cartSchema = new mongoose.Schema({
    products: [productSchemaCart]
})

const cartsModel = mongoose.model(collection, cartSchema);

export default cartsModel;