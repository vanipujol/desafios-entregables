import { Router } from "express";
import {upload} from "../middlewares/multer.js";
import {UsersController} from "../controller/users.controller.js";

const router = Router();

router.post("/premium/:uid", UsersController.changeRole);

router.post("/:uid/documents", upload.single('document'), UsersController.addDocuments);



export { router as userRouter };