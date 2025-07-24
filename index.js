import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("uploads", express.static("uploads"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Origin,X-Requested-With,Content-Type,Accept");
  next();
});

app.listen(8000, () => {
  console.log("App listening on port 8000...");
});
