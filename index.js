  // dotenv setup
  dotenv.config();
  
  import express from 'express'; 
  import cors from 'cors';
  import dotenv from 'dotenv';
  import db from './db/connect.js';
  import nodemailer from 'nodemailer';
  import userRoutes from './routes/userRoutes.js';
  import invoiceRouter from './routes/invoice.route.js';
  import clientRouter from './routes/clients.route.js';
  import profile from './routes/profile.route.js';
  import pdfTemplate from './documents/index.js';
  import emailTemplate from './documents/email.js';
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';
  import pdf from 'html-pdf';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // web server

  const app = express();
  app.use(cors());

  // connecting to database
  db();
  
  //app.use(express.json());
  
  // Middlewares
 
  app.use(express.json({ limit: '30mb', extented: true }));
  app.use('/invoices', invoiceRouter);
  app.use('/clients', clientRouter);
  app.use('/users', userRoutes);
  app.use('/profiles', profile);


  // Nodemailer transport for sending invoice bill print format

  var options = { format: 'A4'};

  //send pdf invoice from email

  app.post('/send-pdf', async (req,res) => {
    const { email, company } = req.body;
    try{
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mail = {
        from: `BoBinvoice <hello@invoicebill.com`, // ==> sender address
        to: `${ email }`, // ==> list receiver
        replyTo: `Invoice from ${
          company.bussinessName ? company.bussinessName : company.name
        }`, // ==> subject line
        text: `Invoice from ${
          company.bussinessName ? company.bussinessName : company.name
        }`, // ==> plain text 
        html: emailTemplate(req.body), // ==> html body template
        attachments: [
          {
            filename: 'invoice-pdf',
            path: `${ __dirname}/invoice.pdf`,
          },
        ],
      };

      transporter.sendMail(mail,(err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Mail has been sent..", info.response);
          res.status(200).json({ message: "Mail has been sent successfully..!"});
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  // create a bill to send pdf invoice

  app.post('/create-pdf', (req,res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
      if (err) {
        res.send(Promise.reject());
      } else {
        res.send(Promise.resolve());
      }
    });
  });

  //pdf invoice

  app.get('/fetch-pdf', (req,res) => {
    res.sendFile(`${__dirname}/invoice.pdf`);
  });

  app.get('/' , (req,res) => {
      res.send("Welcome To Our BoB`s Inventory Collection App ✨✨🎊🎉")
  });

  const PORT = process.env.PORT || 4000;


  app.listen(PORT, () => {
    console.log(`App is running on the port ${PORT}...!`);
  });