import express from "express";
import {
    getAllLomba,
    getLombaById,
    createLomba,
    updateLomba,
    deleteLomba,
} from "../controllers/Lomba.js";
import { verifyUser} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/Lomba', verifyUser, getAllLomba);
router.get('/Lomba/:id', verifyUser, getLombaById);
router.post('/Lomba', verifyUser, createLomba);
router.patch('/Lomba/:id', verifyUser, updateLomba);
router.delete('/Lomba/:id', verifyUser, deleteLomba);

export default router;
