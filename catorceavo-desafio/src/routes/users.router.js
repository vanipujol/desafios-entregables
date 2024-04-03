import { Router } from "express";
import SessionsController from "../controller/sessions.controller.js";

const router = Router();

router.post("/premium/:uid", SessionsController.changeRole);


export { router as userRouter };