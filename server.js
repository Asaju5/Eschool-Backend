import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import uploader from 'express-fileupload'
const morgan = require("morgan");
require("dotenv").config();

//express
const app = express();

//db
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

//middleware
app.use(cors());
app.use(express.json());
app.use(uploader())
app.use(morgan("dev"));


readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)))

const port = process.env.PORT

app.listen(port, () => console.log(`Server is running on port ${port}`))