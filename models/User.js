import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
    }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema)