import express from "express";
import {
    getDashboard,
    getDashboardById,
    createDashboard,
    updateDashboard,
    deleteDashboard
} from "../controllers/Dashboard.js";
import { verifyUser } from "../middleware/AuthUser.js";
import uploadDashboard from "../multerCloudinary.js";

const router = express.Router();

router.get('/Dashboard', verifyUser, getDashboard);
router.get('/Dashboard/:id', verifyUser, getDashboardById);
router.post('/Dashboard', verifyUser, uploadDashboard.single('imageUrl'), createDashboard);
router.patch('/Dashboard/:id', verifyUser, uploadDashboard.single('imageUrl'), updateDashboard);
router.delete('/Dashboard/:id', verifyUser, deleteDashboard);

export default router;