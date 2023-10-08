import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_LOCAL || "mongodb://localhost/node_auth_development");

export const db = mongoose.connection;

db.on("error",(error) => {
    console.log(error);
});

db.once("open",() => {
    console.log("MongoDb connected successfully");
});