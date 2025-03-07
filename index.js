import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { NovelRoute } from "./routers/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGODB_URL;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("err", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
// cho phép các nguồn khác truy cập api
app.use(cors({ credentials: true, origin: true }));

app.use("/api/novels", NovelRoute);
