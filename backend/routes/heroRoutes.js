import express from 'express';
import multer from 'multer';
import Hero from '../models/heroModel.js';
import { storage, deleteFromCloudinary } from '../config/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Get all active hero slides
router.get('/', async (req, res) => {
    try {
        const slides = await Hero.find({ isActive: true });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Add a hero slide
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { heading, subHeading, description, productCode, type, productId } = req.body;
        // Save relative path for frontend access
        const image = req.file ? req.file.path : '';

        const heroData = {
            image,
            heading,
            subHeading,
            description,
            productCode,
            type: type || 'product',
        };

        if (productId && productId !== 'null' && productId !== 'undefined') {
            heroData.productId = productId;
        }

        const slide = new Hero(heroData);
        const savedSlide = await slide.save();
        res.status(201).json(savedSlide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin: Edit a hero slide
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { heading, subHeading, description, productCode, type, productId } = req.body;
        const slide = await Hero.findById(req.params.id);

        if (slide) {
            slide.heading = heading || slide.heading;
            slide.subHeading = subHeading || slide.subHeading;
            slide.description = description || slide.description;
            slide.productCode = productCode || slide.productCode;
            slide.type = type || slide.type;

            if (productId && productId !== 'null' && productId !== 'undefined') {
                slide.productId = productId;
            } else if (type === 'coming_soon') {
                slide.productId = undefined; // Clear product if coming soon
            }

            if (req.file) {
                // Delete old image from Cloudinary
                if (slide.image) {
                    await deleteFromCloudinary(slide.image);
                }
                slide.image = req.file.path;
            }

            const updatedSlide = await slide.save();
            res.json(updatedSlide);
        } else {
            res.status(404).json({ message: 'Slide not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin: Delete a hero slide
router.delete('/:id', async (req, res) => {
    try {
        const slide = await Hero.findById(req.params.id);
        if (slide && slide.image) {
            await deleteFromCloudinary(slide.image);
        }
        await Hero.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slide deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
