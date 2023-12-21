import express from "express";
import { cartRouter } from "./routes/carts.routes.js";
import { productRouter } from "./routes/products.routes.js";
import {engine} from "express-handlebars";
import viewRouter from "./routes/views.route.js";
import __dirname from "./utils.js";
import {Server} from "socket.io";
import {ProductManagerMongo} from "./dao/mongoManagers/ProductMongoManager.js";
import mongoose from "mongoose";
import {ChatMongoManager} from "./dao/mongoManagers/ChatMongoManager.js";

const PORT = 8080;
const app = express();
const MONGO = "mongodb+srv://vanipujol:1438@cluster0.5l6lb6u.mongodb.net/ecommerce"
const connection = mongoose.connect(MONGO);
const httpServer = app.listen(PORT, () => console.log(`Servidor funcionando en el puerto: ${PORT}`));
const productManager = new ProductManagerMongo()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/", viewRouter);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const chatManager = new ChatMongoManager()
const io = new Server(httpServer);
let messages = [];
io.on("connection", (socket)=>{

    socket.on("chat-message", (data)=>{
        messages.push(data);
        io.emit("messages", messages);

        const payload = {
            "user": data.username,
            "message": data.message
        }

        chatManager.addMessage(payload);

    })

    socket.on("new-user", (username)=>{
        socket.emit("messages",messages);
        socket.broadcast.emit("new-user", username);
    })
})

/**
 * Handle Socket.IO connections and events.
 */
/*
io.on("connection", async socket => {
    try {

        console.log('Nuevo cliente conectado');

        const products = await productManager.getProducts()

        io.to(socket.id).emit("products-list-update", products)

        /!**
         * Handle the "products-list" event, add a product, and emit the updated list.
         *!/

        socket.on("products-list", async (data) => {

            let productsMessages = await productManager.addProduct(data)

            io.emit("products-list-update", productsMessages)
        })

        /!**
         * Handle the "products-list-delete" event, delete a product, and emit the updated list.
         *!/

        socket.on("products-list-delete", async (data) => {

            let productsMessages = await productManager.deleteProduct(data)

            if (productsMessages === "Not found") {
                console.log("Producto no encontrado")
            } else {
                io.emit("products-list-update", productsMessages)
            }

        })

    } catch (error) {
        console.error('Error con la conexión del socket:', error.message);
    }
})*/
