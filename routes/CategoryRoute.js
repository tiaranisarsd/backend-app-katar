import express from "express";
import {
    getCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByLomba
} from "../controllers/Category.js";
import { verifyUser} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/Category', verifyUser, getCategory);
router.get('/Category/:id', verifyUser, getCategoryById);
router.post('/Category', verifyUser, createCategory);
router.patch('/Category/:id', verifyUser, updateCategory);
router.delete('/Category/:id', verifyUser, deleteCategory);
router.get('/Category/lomba/:lombaId', verifyUser, getCategoryByLomba); 

export default router;
