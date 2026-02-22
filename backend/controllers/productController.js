import Product from '../models/productModel.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, featured } = req.body;

        if (isNaN(parseFloat(price))) {
            return res.status(400).json({ message: 'Invalid price' });
        }
        if (isNaN(parseInt(stock))) {
            return res.status(400).json({ message: 'Invalid stock' });
        }

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => file.path);
        }

        const product = new Product({
            name,
            price,
            user: req.user._id,
            images: imagePaths.length > 0 ? imagePaths : ['/images/sample.jpg'],
            category,
            stock,
            description,
            featured: featured === 'true',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (e) {
        console.error("CREATE PRODUCT ERROR:", e);
        res.status(500).json({ message: e.message, stack: e.stack });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, featured } = req.body;

        if (price !== undefined && isNaN(parseFloat(price))) {
            return res.status(400).json({ message: 'Invalid price' });
        }
        if (stock !== undefined && isNaN(parseInt(stock))) {
            return res.status(400).json({ message: 'Invalid stock' });
        }

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.stock = stock || product.stock;

            if (featured !== undefined) {
                product.featured = featured === 'true';
            }

            if (req.files && req.files.length > 0) {
                // Delete old images from Cloudinary
                if (product.images && product.images.length > 0) {
                    for (const image of product.images) {
                        await deleteFromCloudinary(image);
                    }
                }
                product.images = req.files.map(file => file.path);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (e) {
        console.error("UPDATE PRODUCT ERROR:", e);
        res.status(500).json({ message: e.message, stack: e.stack });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                await deleteFromCloudinary(image);
            }
        }
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
