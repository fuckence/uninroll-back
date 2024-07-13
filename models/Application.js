import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);