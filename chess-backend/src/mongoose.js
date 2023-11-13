import mongoose from "mongoose";
mongoose
  .connect(
    "mongodb+srv://Harsh:harsh123@cluster0.oae138b.mongodb.net/chess-game",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err.message);
  });

export const connectDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://jashwanth:jashwanthbj9@chess.pww3bsh.mongodb.net/?retryWrites=true"
    );

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};