import express from 'express';  /* routes to implement to our model as a parallel */
import {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    getInvoicesByUser,
    getTotalCount,
  } from '../controllers/invoices.js';

const router = express.Router();

router.get('/:id', getInvoice); 
router.get('/count', getTotalCount);  // to generate Invoice serial number
router.get('/', getInvoicesByUser);  // to get a user invoice
router.post('/', createInvoice); // to create a invoice
router.put('/:id', updateInvoice); // to update a existing Invoice
router.delete('/:id', deleteInvoice); // to delete a invoice

export default router;
