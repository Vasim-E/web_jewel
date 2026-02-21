import express from 'express';
import multer from 'multer';
import Category from '../models/categoryModel.js';
import { storage } from '../config/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a category
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? req.file.path : '';

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name,
            description,
            image,
        });

        if (category) {
            res.status(201).json(category);
        } else {
            res.status(400).json({ message: 'Invalid category data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a category
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = req.body.name || category.name;
            category.description = req.body.description || category.description;

            if (req.file) {
                category.image = req.file.path;
            }

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await Category.deleteOne({ _id: category._id });
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
