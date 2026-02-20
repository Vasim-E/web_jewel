import mongoose from 'mongoose';

const packagingOptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['box', 'cloth', 'cushion', 'ribbon'],
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    colorCode: {
        type: String, // Hex code for color selection
    },
    imageUrl: {
        type: String,
    }
}, {
    timestamps: true,
});

const PackagingOption = mongoose.model('PackagingOption', packagingOptionSchema);

export default PackagingOption;
