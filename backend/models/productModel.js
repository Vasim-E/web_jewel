import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    discountPrice: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    category: {
        type: String,
        required: true,
        default: 'Uncategorized',
    },
    featured: {
        type: Boolean,
        default: false,
    },
    isCustomPackagingAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
