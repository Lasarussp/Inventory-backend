import mongoose from "mongoose";
import InvoicesModel from '../models/InvoicesModel.js';

export const getInvoicesByUser = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const invoices = await InvoicesModel.find({ creator: searchQuery });
        res.status(200).json({ data: invoices });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getTotalCount = async (req,res) => {
    const { searchQuery } = req.query;
    try {
        //const invoices = await InvoicesModel.find({ creator: searchQuery });
        const totalCount = await InvoicesModel.countDocuments({
            creator: searchQuery,
        });
        res.status(200).json(totalCount);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } 
};

export const getInvoices = async (req,res) => {
    try {
        const allInvoices = await InvoicesModel.find({}).sort({ _id: -1 });
        res.status(200).json(allInvoices);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const createInvoice = async (req, res) => {
    const invoice = req.body;
    const newInvoice = new InvoiceModel(invoice);
    try {
      await newInvoice.save();
      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(409).json(error.message);
    }
  };

export const getInvoice = async (req,res) => {
    const { id } = req.body;
    try {
        const invoice = await InvoicesModel.findById(id);
        res.status(200).json({ message: error.message });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateInvoice = async (req,res) => {
    const { id : _id } = req.params;
    const invoice = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No invoice with that id');
    const updateInvoice = await InvoicesModel.findByIdAndUpdate(
        _id,
        { ...invoice, _id },
        { new: true }
    );
    res.json({ message: 'Invoice updated sucessfully'});
};

export const deleteInvoice = async (req,res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No invoice with that id');
    await InvoicesModel.findByIdAndRemove(id);
    res.json({ message: 'Invoice deleted successfully!'});
};

