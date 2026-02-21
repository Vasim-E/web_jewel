import express from 'express';
import multer from 'multer';
import path from 'path';
import { storage } from '../config/cloudinary.js';
import { fileURLToPath } from 'url';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.route('/').get(getProducts).post(protect, admin, upload.array('images', 5), createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.array('images', 5), updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
