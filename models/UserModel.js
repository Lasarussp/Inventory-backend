import mongoose from 'mongoose';

//Schema definition:

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, /* it must be smallletters */
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    expireToken: Date,
});


//model schema using the schema defined

const User = mongoose.Schema('User', userSchema);
export default User;