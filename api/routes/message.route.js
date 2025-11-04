import { verifyToken } from "../middleware/jwt.js"
import express from "express"
import {
    createMessage,
    getMessage
} from "../controllers/message.controllers.js"

const router = express.Router()

router.post("/",verifyToken, createMessage);
router.get("/:id",verifyToken, getMessage);

export default router;