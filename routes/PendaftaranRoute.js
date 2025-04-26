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

router.get('/Pendaftaran', verifyUser, getPendaftaran);
router.get('/Pendaftaran/:id', verifyUser, getPendaftaranById);
router.post('/Pendaftaran', verifyUser, createPendaftaran);
router.patch('/Pendaftaran/:id', verifyUser, updatePendaftaran);
router.delete('/Pendaftaran/:id', verifyUser, deletePendaftaran);

export default router;