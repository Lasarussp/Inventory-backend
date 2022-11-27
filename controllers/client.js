import mongoose from "mongoose";
import ClientModel from '../models/ClientModel.js';

/* export const getClients = async (req,res) => {
    const userId = req.body;
    try{
        const allClients = await ClientModel.find({ userId: userId }).sort({ _id:-1 });
        res.status(200).json(allClients);
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}; */

export const getClient = async (req,res) => {
    const { id } = req.params;
    try{
        const client = await ClientModel.find(id);
        res.status(200).json(client);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getClients = async (req, res) => {
    const { page } = req.query;
    try{
        const Limit = 6;
        const startIndex = (Number(page) -1 ) * Limit; //get starting index of the page
        const total = await ClientModel.countDocuments({});
        const clients = await ClientModel.find()
        .sort({ _id: -1 })
        .limit(Limit)
        .skip(startIndex);
        res.status(200).json({ 
            data: clients,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / Limit),
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createClient = async (req, res) => {
    const client = req.body;
    const newClient = new ClientModel({
        ...client,
        createAt: new Date().toISOString(),
    });
    try {
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(409).json({ message: error.message});
    }
};

export const updateClient = async (req, res) => {
    const { id: _id } = req.params;  // id is equal to _id
    const client = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id))
    return  res.status(404).send('No client wth that id');
    const updateClient = await ClientModel.findByIdAndUpdate(
        _id,
        { ...client, _id },
        { new : true }
    );
    res.json({ message: 'Updated client succesfully' });
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No Client with that id');
    await ClientModel.findByIdAndRemove(id);
    res.json({ message: 'Client deleted successfully' });
  };
  
export const getClientsByUser = async (req, res) => {
    const { searchQuery } = req.query;
    try {
      const clients = await ClientModel.find({ userId: searchQuery });
      res.json({ data: clients });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
