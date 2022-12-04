import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';
import ProfileModel from '../models/ProfileModel.js';
dotenv.config();

const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

export const signin = async (req,res) => {
    const { email, password } = req.body; //coming from user data
    try {
        const existingUser = await User.findOne({ email });
        // get userprofile and append to login auth detail
        const userprofile = await ProfileModel.findOne({
            userId: existingUser?._id,
        });
        if(!existingUser)
        return res.status(404).json({ message: 'Invalid credentials!'});
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordCorrect)
        return res.status(400).json({ message: 'Invalid credentials!'});
        // if credentials are valid create a token for the user
        const token = jwt.sign(
           { email: existingUser.email,
             id: existingUser._id },
             SECRET,
             { ecpiresIn : '1h' }
        );
        // then send the token to the client/frontend/user
        res.status(200).json({ result: existingUser,userprofile, token });
    } catch (error) {
        res.status(500).json({ message: 'Somhing went wrong? '});
    }
};

export const signup = async (req,res) => {
    const { email,password, confirmPassword, firstName, lastName, bio } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        const userprofile = await ProfileModel.findOne({
            userId: existingUser?._id,
        });
        if(existingUser)
        return res.status(400).json({ message: "User already exist,pls different email?"});
        if(password !== confirmPassword)
        return res.status(400).json({ message: "Password don't match"})
        const hashedPassword = await bcrypt.hash(password,12);
        const result = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            bio,
        });
        const token = jwt.sign({ email: result.email, id: result._id },
            SECRET,
            { expiresIn: '1h'},
        );
        res.status(200).json({ result, userprofile, token });

    } catch (error) {
        res.status(500).json({ message: 'Somthing went wrong'});
    }
};

/* 
const updateProfile = async (req,res) => {
    const formData = req.body;
    const { id:_id } = req.params;
    console.log(formData);
    if(!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('no user with this id found')
    const updatedUser = await User.findByIdAndUpdate(_id,formData, { new: true})
    res.json(updatedUser);
}
*/

export const forgetPassword = (req,res) => {
    const { email } = req.body;
    // nodemailer transport for sending notification via email
    const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
            user: USER,
            pass: PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    
    crypto.randomBytes(32,(err,buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: email }).then((user) => {
            if (!user) {
              return res
                .status(422)
                .json({ error: "User does not in our database"});
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user 
            .save()
            .then((result) => {
                transporter.sendMail({ 
                    to:user.email,
                    from: 'BoB`sinvoice <hello@invoicebill.com>',
                    subject: 'Password reset request',
                    html: `
                           <p>You requested for password rest from arc Invoicing Application</p>
                           <h5>Please click this <a href="https://netlify.app/reset/${token}">link</a>to reset your password</h5>
                           <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                           <p>https://nelify.app/reset/${token}</p>
                           <p>If this was a mistake ,just ignore this email and nothing will happen.</p>
                           `,
                });
                res.json({ message: 'check your email'});
            })
            .catch((err) => console.log(err));
        });
    });
};

export const resetPassword = (req,res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expireToken: {$gt: Date.now() }})
    .then((user) => {
        if (!user) {
            return res.status(422).json({ error:"Try again session has expired"});
        }
        bcrypt.hash(newPassword, 12).then((hashedPassword) => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then((saveduser) => {
                res.json({ message: "Password updated successfully!"});
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });
};

