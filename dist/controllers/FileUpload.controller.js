"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const slugify_1 = __importDefault(require("slugify"));
// Define the folder where the images will be stored
const FOLDER_NAME = `/images/`;
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = `${process.env.IMAGE_UPLOAD_PATH}${FOLDER_NAME}`;
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${(0, slugify_1.default)(file.originalname)}`);
    },
});
// Multer file filter for image and video types
const fileFilter = (req, file, cb) => {
    if (["image/jpeg", "image/png", "video/mp4", "video/quicktime"].includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images and videos are allowed!"));
    }
};
// Multer configuration for multiple uploads
const multiUploads = (0, multer_1.default)({ storage, fileFilter }).fields([
    { name: "images" },
]);
// Image upload handler
exports.uploadImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    multiUploads(req, res, (err) => {
        console.log(req.files);
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        try {
            let images = [];
            // Explicitly cast req.files to the correct type
            const files = req.files;
            if (files && files["images"]) {
                images = files["images"].map((file) => `${process.env.IMAGE_PUBLIC_URL}${FOLDER_NAME}${(0, slugify_1.default)(file.filename)}`);
            }
            return res.status(200).json({ success: true, images });
        }
        catch (error) {
            return res
                .status(500)
                .json({
                success: false,
                message: error.message || "Server error, try again!",
            });
        }
    });
}));
