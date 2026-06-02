import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});
console.log(process.env.MONGO_URI);


import connectDB from "./db/index.js";



connectDB();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error", (error) => {
//       console.log("error", error);
//       throw error;
      
//     });

//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`app is listening on port ${process.env.PORT || 8000}`);
      
//     });

//   } catch (error){
//     console.log("ERROR", error);
//     throw error;
    
//   }
// })();