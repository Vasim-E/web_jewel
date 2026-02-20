import express from 'express';
import Marquee from '../models/marqueeModel.js';

const router = express.Router();

// Get the marquee settings
router.get('/', async (req, res) => {
    try {
        let marquee = await Marquee.findOne();
        if (!marquee) {
            marquee = new Marquee();
            await marquee.save();
        }
        res.json(marquee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update marquee settings
router.put('/', async (req, res) => {
    try {
        const { text, isActive, bgColor, textColor } = req.body;
        let marquee = await Marquee.findOne();

        if (!marquee) {
            marquee = new Marquee({ text, isActive, bgColor, textColor });
        } else {
            if (text !== undefined) marquee.text = text;
            if (isActive !== undefined) marquee.isActive = isActive;
            if (bgColor !== undefined) marquee.bgColor = bgColor;
            if (textColor !== undefined) marquee.textColor = textColor;
        }

        const updatedMarquee = await marquee.save();
        res.json(updatedMarquee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
