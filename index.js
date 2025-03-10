import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from "cors";
import { AuthRoute, NovelRoute, UserRoute } from "./routers/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGODB_URL;

//giúp Express có thể hiểu và xử lý dữ liệu JSON được gửi từ client (thông qua req.body).
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
// cho phép các nguồn khác truy cập api
app.use(cors({ credentials: true, origin:true}));
app.use(cookieParser());

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


app.use("/api/novels", NovelRoute);
app.use('/api',AuthRoute);
app.use('/api/user', UserRoute)


