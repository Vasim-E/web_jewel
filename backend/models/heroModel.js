import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    heading: {
        type: String,
        required: true,
    },
    subHeading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    productCode: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['product', 'coming_soon'],
        default: 'product'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true,
});

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
