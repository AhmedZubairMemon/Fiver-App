import express from "express"
import { createGig, deleteGig, getGig, getGigs, updateGig } from "../controllers/gig.controllers.js"
import { verifyToken } from "../middleware/jwt.js"

const router = express.Router()

router.post("/",verifyToken, createGig)
router.delete("/:id",verifyToken, deleteGig)
router.put("/:id", verifyToken, updateGig);
router.get("/single/:id", getGig)
router.get("/", getGigs)

export default router;