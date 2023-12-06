import express from "express";
import {engine} from "express-handlebars";
import viewRouter from "./routes/views.route.js";
import __dirname from "./utils.js";
import {Server} from "socket.io";
import {ProductManagerFile} from "./managers/ProductManagerFile.js";

const PORT = 8080;
const app = express();

const httpServer = app.listen(PORT, () => console.log(`Servidor funcionando en el puerto: ${PORT}`));

const socketServer = new Server(httpServer);

const path = '../files/products.json'
const productManagerFile = new ProductManagerFile(path)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/", viewRouter);

/**
 * Handle Socket.IO connections and events.
 */
socketServer.on("connection", async socket => {
    try {

        console.log('Nuevo cliente conectado');

        const products = await productManagerFile.getProducts()

        socketServer.to(socket.id).emit("products-list-update", products)

        /**
         * Handle the "products-list" event, add a product, and emit the updated list.
         */

        socket.on("products-list", async (data) => {

            let productsMessages = await productManagerFile.addProduct(JSON.parse(data))

            socketServer.emit("products-list-update", productsMessages)
        })

        /**
         * Handle the "products-list-delete" event, delete a product, and emit the updated list.
         */

        socket.on("products-list-delete", async (data) => {

            let productsMessages = await productManagerFile.deleteProduct(parseInt(data))

            if (productsMessages === "Not found") {
                console.log("Producto no encontrado")
            } else {
                socketServer.emit("products-list-update", productsMessages)
            }

        })

    } catch (error) {
        console.error('Error con la conexión del socket:', error.message);
    }
})