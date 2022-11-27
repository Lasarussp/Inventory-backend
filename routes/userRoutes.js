import express from 'express';  /* routes to implement to our model as a parallel */
import { signin,
         signup,
         forgetPassword,
         resetPassword,} from '../controllers/user.js';
const router = express.Router();

router.post('/signin', signin); // to do sign in page
router.post('/signup', signup);  //to do sign up page
router.post('/forget', forgetPassword); //to remember your password to reset
router.post('/reset', resetPassword); //to reset your password

export default router;
