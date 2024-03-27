import express from "express";
import session from "express-session";
import { cartRouter } from "./routes/carts.routes.js";
import { productRouter } from "./routes/products.routes.js";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import MongoStore from "connect-mongo";
import {ChatMongoManager} from "./dao/mongoManagers/ChatMongoManager.js";
import passport from "passport";

import viewRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import sessionRouter from "./routes/sessions.routes.js";
import {userRouter} from "./routes/users.router.js";

import initializePassport from "./config/passport.config.js";

import {options} from "./config/config.js";
import mongoose from "mongoose";
import mockingRouter from "./routes/mocking.router.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {addLogger} from "./loggers/loggers.js";
import loggerTestRoutes from "./routes/loggerTest.routes.js";

import {productService} from "./repository/index.repository.js";
import swaggerUi from "swagger-ui-express";
import {swaggerSpecs} from "./config/docConfig.js";

const PORT = options.PORT;
const app = express();
const MONGO = options.MONGO_URL;
const connection = mongoose.connect(MONGO);
const httpServer = app.listen(PORT, () => console.log(`Servidor funcionando en el puerto: ${PORT}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(addLogger);

initializePassport()
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl:3600
    }),
    secret:"CoderSecret",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/", viewRouter);
app.use('/api/sessions', sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/mockingproducts", mockingRouter);
app.use("/loggerTest", loggerTestRoutes);
app.use("/api/users", userRouter);
app.use("/api/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpecs));

app.use(errorHandler);

// const chatManager = new ChatMongoManager()
// let messages = [];
// io.on("connection", (socket)=>{
//
//     socket.on("chat-message", (data)=>{
//         messages.push(data);
//         io.emit("messages", messages);
//
//         const payload = {
//             "user": data.username,
//             "message": data.message
//         }
//
//         chatManager.addMessage(payload);
//
//     })
//
//     socket.on("new-user", (username)=>{
//         socket.emit("messages",messages);
//         socket.broadcast.emit("new-user", username);
//     })
// })

/**
 * Handle Socket.IO connections and events.
 */
const io = new Server(httpServer);
io.on("connection", async socket => {
    try {

        console.log('Nuevo cliente conectado');

        const products = await productService.getProducts()

        io.to(socket.id).emit("products-list-update", products)

        socket.on("products-list", async (data) => {

            if (data){
            let productsMessages = await productService.addProduct(JSON.parse(data))
            }
            const products = await productService.getProducts()
            io.emit("products-list-update", products)
        })

    } catch (error) {
        console.error('Error con la conexión del socket:', error.message);
    }
})