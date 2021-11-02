import mongoose from 'mongoose'

const {Schema} = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please enter your name"],
    },

    email: {
        type: String,
        trim: true,
        required: [true, "Please enter your email"],
        unique: true
    },

    password: {
        type: String,
        trim: true,
        required: [true, "Please enter your password"],
        min: 8,
        max: 80
    },

    picture: {
        type: String,
        default: "/avatar.png",
    },

    role: {
        type: [String],
       default: ["Student"],
       enum: ['Student', 'Tutor', 'Admin']
    },

    paystack_account_id: "",
    paystack_seller: {},
    paystackSession: {},
}, {timestamps: true})


export default mongoose.model('User', userSchema)