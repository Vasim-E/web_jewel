import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import Hero from '../models/heroModel.js';
import Marquee from '../models/marqueeModel.js';

dotenv.config({ path: '../.env' });

const LOCAL_URI = 'mongodb://127.0.0.1:27017/jewel_db';
const ATLAS_URI = process.env.MONGO_ATLAS_URI;

if (!ATLAS_URI) {
    console.error('❌ Error: MONGO_ATLAS_URI is not defined in your environment.');
    console.log('Usage: MONGO_ATLAS_URI="mongodb+srv://..." node migrateToAtlas.js');
    process.exit(1);
}

const migrate = async () => {
    try {
        console.log('🔌 Connecting to LOCAL database...');
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('✅ Connected to LOCAL.');

        console.log('🔌 Connecting to ATLAS database...');
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('✅ Connected to ATLAS.');

        // Define models for each connection
        const LocalProduct = localConn.model('Product', Product.schema);
        const AtlasProduct = atlasConn.model('Product', Product.schema);

        const LocalHero = localConn.model('Hero', Hero.schema);
        const AtlasHero = atlasConn.model('Hero', Hero.schema);

        const LocalMarquee = localConn.model('Marquee', Marquee.schema);
        const AtlasMarquee = atlasConn.model('Marquee', Marquee.schema);

        // 1. Migrate Products
        console.log('📦 Fetching Products from local...');
        const products = await LocalProduct.find({});
        console.log(`Found ${products.length} products.`);

        if (products.length > 0) {
            console.log('🚀 Uploading Products to Atlas...');
            for (const product of products) {
                const productData = product.toObject();
                // Match by _id to preserve references in other models
                await AtlasProduct.findOneAndUpdate(
                    { _id: productData._id },
                    productData,
                    { upsert: true, new: true }
                );
            }
            console.log('✅ Products migrated.');
        }

        // 2. Migrate Hero Slides
        console.log('🖼️ Fetching Hero Slides from local...');
        const heroes = await LocalHero.find({});
        if (heroes.length > 0) {
            for (const hero of heroes) {
                const heroData = hero.toObject();
                await AtlasHero.findOneAndUpdate(
                    { _id: heroData._id },
                    heroData,
                    { upsert: true }
                );
            }
            console.log('✅ Hero slides migrated.');
        }

        // 3. Migrate Marquee
        console.log('🏃 Fetching Marquee from local...');
        const marquee = await LocalMarquee.findOne({});
        if (marquee) {
            const marqueeData = marquee.toObject();
            await AtlasMarquee.findOneAndUpdate({ _id: marqueeData._id }, marqueeData, { upsert: true });
            console.log('✅ Marquee settings migrated.');
        }

        console.log('\n✨ MIGRATION COMPLETE! Your Atlas database is now synced with your local data.');

        await localConn.close();
        await atlasConn.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
