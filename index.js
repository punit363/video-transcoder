import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process"; //dangerous for server

const app = express();

const storage = multer.diskStorage({
  destination: function (req, filename, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, filename, cb) {
    cb(
      null,
      filename.fieldname + "-" + uuidv4() + path.extname(filename.originalname)
    );
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", (req, res, _next) => {
  console.log("file uploaded");
  res.send("hello");
});

app.post("/upload", upload.single("file"), (req, res, _next) => {
  console.log("file uploaded");

  const lesson_id = uuidv4();
  const video_path = req.file.path;
  const output_path = `./uploads/courses/${lesson_id}`;
  const hls_path = `${output_path}/index.m3u8`;

  console.log(hls_path, "+++++++hlspath");

  if (!fs.existsSync(output_path)) {
    fs.mkdirSync(output_path, { recursive: true });
  }

  const ffmpegCommand = `ffmpeg -i ${video_path} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${output_path}/segment%03d.ts" -start_number 0 ${hls_path}`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log("exec err", error);
    }
    console.log("exec stdout", stdout);
    console.log("exec stderr", stderr);
  });

  res.json({ message: "File uploaded successfully" });
});

app.listen(8000, () => {
  console.log("App listening on port 8000...");
});
