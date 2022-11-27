import express from 'express';  /* routes to implement to our model as a parallel */
import { 
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientsByUser
} from '../controllers/client.js';

const router = express.Router();

router.get('/', getClients);  // to get all clients
router.get('/user', getClientsByUser);  // to get a particular user
router.post('/', createClient); // to create a client
router.put('/:id', updateClient); // to update a existing client
router.delete('/:id', deleteClient); // to delete a cilent

export default router;
