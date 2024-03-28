import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { TCloudinaryResponse, TFile } from "../App/interface/uploadFile";

cloudinary.config({
  cloud_name: "dvfrp0jxn",
  api_key: "833254318926982",
  api_secret: "Z3Nro9FDoBAbxWFNkA--QUaXhFc",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: TFile) => {
  return await cloudinary.uploader.upload(
    file.path,
    { public_id: file.originalname },
    (error, result) => {
      if (result) {
        fs.unlinkSync(file.path);
        return result;
      } else {
        fs.unlinkSync(file.path);
        return error;
      }
    }
  );
};

export default { upload, uploadToCloudinary };