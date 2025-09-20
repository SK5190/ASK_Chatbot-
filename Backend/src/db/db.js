const mongoose = require('mongoose')

async function connectToDb (){
   try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to DB.")
   } catch (error) {
     console.log("Error connecting to MongoDB:",error)
   }

   
}
module.exports = connectToDb;