import express from "express";
import {
    getPendaftaran,
    getPendaftaranById,
    createPendaftaran,
    updatePendaftaran,
    deletePendaftaran
} from "../controllers/Pendaftaran.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pendaftaran', verifyUser, getPendaftaran);
router.get('/pendaftaran/:id', verifyUser, getPendaftaranById);
router.post('/pendaftaran', verifyUser, createPendaftaran);
router.patch('/pendaftaran/:id', verifyUser, updatePendaftaran);
router.delete('/pendaftaran/:id', verifyUser, deletePendaftaran);

export default router;