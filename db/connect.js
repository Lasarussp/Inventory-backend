 import mongoose from "mongoose";  // to communicate with our db 

 const db = async () => {
    try{
       await mongoose.connect(`${process.env.MONGO_URL}`);
       console.log("Database connected successfully.....!")
    } catch (error) {
        console.log("Error while connecting database: ",error);
    }
 };
 
 mongoose.connection.off('disconnected',() => {
    console.log("mongodb disconnected ❌")
 });
 mongoose.connection.on('connected',() => {
    console.log("mongodb connected ✔️")
 });


 export default db;

