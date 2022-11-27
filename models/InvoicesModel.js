import mongoose from "mongoose";

//Schema definition:

const InvoiceSchema = new mongoose.Schema({
    dueDate: Date,
    currency: String,
    items: [
        {
            itemName: String,
            unitPrice: String,
            quentity: String,
            discount: String,
        },
    ],
    rates: String,
    vat: Number,      /* value added tax */
    total: Number,
    subTotal: Number,
    notes: String,
    status: String,
    invoiceNumber: String,
    type: String,
    creator: [String],
    totalAmountRecevied: Number,
    client: {
        name: String,
        email: String,
        phone: String,
        address: String,
    },
    paymentRecords: [
        {
            amountPaid: Number,
            datePaid: Date,
            paymentMethod: String,
            note: String,
            paidBy: String,
        },
    ],
    createdAt: {
        type: Date,
        default: new Date(),
    },
});


//model schema using the schema defined

const InvoiceModel = mongoose.model('InvoiceModel', InvoiceSchema);
export default InvoiceModel;