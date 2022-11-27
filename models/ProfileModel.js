import mongoose from 'mongoose';

//Schema definition: 

const ProfileSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    paymentDetails: {
        type: String,
        required: true,
    },
    logo: String,
    website: String,
    userId: [String] 
});


//model schema using the schema defined

const ProfileModel = mongoose.model('ProfileModel', ProfileSchema);
export default ProfileModel;