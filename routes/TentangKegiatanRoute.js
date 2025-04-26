import express from "express";
import {
    getTentangKegiatan,
    getTentangKegiatanById,
    createTentangKegiatan,
    updateTentangKegiatan,
    deleteTentangKegiatan
} from "../controllers/TentangKegiatan.js";
import { verifyUser } from "../middleware/AuthUser.js";
import uploadTentangKegiatan from "../multerCloudinary.js";


const router = express.Router();

router.get('/TentangKegiatan', verifyUser, getTentangKegiatan);
router.get('/TentangKegiatan/:id', verifyUser, getTentangKegiatanById);
router.post('/TentangKegiatan', verifyUser, uploadTentangKegiatan.single('image'), createTentangKegiatan);
router.patch('/TentangKegiatan/:id',verifyUser, uploadTentangKegiatan.single('image'), updateTentangKegiatan);
router.delete('/TentangKegiatan/:id', verifyUser, deleteTentangKegiatan);

export default router;