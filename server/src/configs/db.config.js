import mongoose from "mongoose";

const connectDatabase = () => {
  const mongoDbUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
  // const mongoDbUrl = `mongodb+srv://dbMIT:${process.env.MONGO_PW}@clustermit.37lfk.mongodb.net/dbMIT?retryWrites=true&w=majority`;
  console.log(`Connecting to ${mongoDbUrl}`);
  mongoose.Promise = global.Promise;
  // Connecting to the database
  mongoose
    .connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Sucessfully connect to the database");
    })
    .catch(err => {
      console.log(
        `Could not connect to the database. Exiting now...\n${err}`,
      );
      process.exit();
    });
};

export default connectDatabase;
