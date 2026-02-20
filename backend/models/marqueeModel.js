import mongoose from 'mongoose';

const marqueeSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        default: 'shows new collections out , collect now !'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    bgColor: {
        type: String,
        default: 'theme', // 'theme' or 'red' or hex
    },
    textColor: {
        type: String,
        default: 'white'
    }
}, {
    timestamps: true,
});

const Marquee = mongoose.model('Marquee', marqueeSchema);

export default Marquee;
