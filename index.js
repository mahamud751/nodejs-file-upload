const express = require("express");
const multer = require("multer");
const path = require("path");

const folder_name = "./uploads";
const PORT = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder_name);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only .png .jpg .jpeg support"));
      }
    } else if (file.fieldname === "pdf") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("only pdf file support"));
      }
    } else {
      cb(new Error("unknown error"));
    }
  },
});

const app = express();

// app.post("/", upload.single("image"), (req, res) => {
//   res.send("Hello Pino");
// });
// app.post("/", upload.array("image", 3), (req, res) => {
//   res.send("Hello Pino");
// });

app.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 3 },
    { name: "pdf", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.send("home");
  }
);

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("upload error");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});

app.listen(PORT, () => {
  console.log(`server run at http://localhost:${PORT}`);
});
