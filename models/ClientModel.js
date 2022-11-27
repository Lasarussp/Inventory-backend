import mongoose from 'mongoose';

//Schema definition:

const ClientSchema = new mongoose.Schema({
    name: String,
    email: String,
    Phone: String,
    address: String,
    userId: [String],
    createAt: {
        type: Date,
        default: new Date(),
    },
});

//model schema using the schema defined

const ClientModel = mongoose.model('ClientModel', ClientSchema);
export default ClientModel;