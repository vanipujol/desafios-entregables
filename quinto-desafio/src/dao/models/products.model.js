import mongoose from "mongoose";

const collection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail:String,
    status:Boolean
})

const productsModel = mongoose.model(collection, productSchema);

export default productsModel;