import mongoose from 'mongoose';

//Schema definition: 

const ProfileSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
    },
    businessName: {
        type: String,
    },
    paymentDetails: {
        type: String,
    },
    logo: String,
    website: String,
    userId: [String] 
});


//model schema using the schema defined

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;