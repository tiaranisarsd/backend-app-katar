import express from "express";
import {
    getAllBanner,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
} from "../controllers/Banner.js";
import { verifyUser} from "../middleware/AuthUser.js";
import uploadBanner from "../multerCloudinary.js";

const router = express.Router();

router.get('/Banner', verifyUser, getAllBanner);
router.get('/Banner/:id', verifyUser, getBannerById);
router.post('/Banner', verifyUser, uploadBanner.single('imageBanner'), createBanner);
router.patch('/Banner/:id', verifyUser, uploadBanner.single('imageBanner'), updateBanner);
router.delete('/Banner/:id', verifyUser, deleteBanner);

export default router;
