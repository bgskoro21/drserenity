import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const filename = file.originalname;
    cb(null, `${timestamp}-${filename}`);
  },
});

export const upload = multer({
  storage: storage,
});
