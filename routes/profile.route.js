import express from 'express';  /* routes to implement to our model as a parallel */
import {
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    getProfilesByUser,
  } from '../controllers/profile.js';
  
const router = express.Router();

//router.get('/', getProfiles);  // to get all Profiles
router.get('/:id', getProfile);  // to get a profile user
router.get('/', getProfilesByUser) // to get a profile by user
router.post('/', createProfile); // to create a Profile
router.put('/:id', updateProfile); // to update a existing Profile
router.delete('/:id', deleteProfile); // to delete a cilent

export default router;
