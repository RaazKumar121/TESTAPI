"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleUpload = exports.multiUploads = exports.FOLDER_NAME = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const slugify_1 = __importDefault(require("slugify"));
exports.FOLDER_NAME = `/images/`;
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = `${process.env.IMAGE_UPLOAD_PATH}${exports.FOLDER_NAME}`;
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${(0, slugify_1.default)(file.originalname)}`);
    },
});
// File filter configuration
const fileFilter = (req, file, cb) => {
    if (["image/jpeg", "image/png", "video/mp4", "video/quicktime"].includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images and videos are allowed!"));
    }
};
// Multer configuration for multiple uploads
exports.multiUploads = (0, multer_1.default)({ storage, fileFilter }).fields([
    { name: "images" },
]);
exports.singleUpload = (0, multer_1.default)({ storage, fileFilter }).fields([
    { name: "file", maxCount: 1 },
]);
