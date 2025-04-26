import express from "express";
import {
    getAllBanner,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
} from "../controllers/Banner.js";
import { verifyUser} from "../middleware/AuthUser.js";
import { bannerUpload } from "../multerConfig.js";

const router = express.Router();

router.get('/Banner', verifyUser, getAllBanner);
router.get('/Banner/:id', verifyUser, getBannerById);
router.post('/Banner', verifyUser, bannerUpload.single('imageBanner'), createBanner);
router.patch('/Banner/:id', verifyUser, bannerUpload.single('imageBanner'), updateBanner);
router.delete('/Banner/:id', verifyUser, deleteBanner);

export default router;
