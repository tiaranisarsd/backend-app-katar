import express from "express";
import {
    getDokumentasi,
    getDokumentasiById,
    createDokumentasi,
    updateDokumentasi,
    deleteDokumentasi,
} from "../controllers/Dokumentasi.js";
import { verifyUser} from "../middleware/AuthUser.js";
import { dokumentasiUpload } from "../multerConfig.js";

const router = express.Router();

router.get('/Dokumentasi', verifyUser, getDokumentasi);
router.get('/Dokumentasi/:id', verifyUser, getDokumentasiById);
router.post('/Dokumentasi', verifyUser,dokumentasiUpload.single('imageKegiatan'), createDokumentasi);
router.patch('/Dokumentasi/:id', verifyUser, dokumentasiUpload.single('imageKegiatan'), updateDokumentasi);
router.delete('/Dokumentasi/:id', verifyUser, deleteDokumentasi);

export default router;
