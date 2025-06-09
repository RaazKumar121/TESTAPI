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
exports.uploadFile = exports.uploadImages = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const multer_config_1 = require("../config/multer.config");
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
const constants_1 = require("../constants");
// Controller function for multiple file uploads
exports.uploadImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, multer_config_1.multiUploads)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        try {
            let images = [];
            const files = req.files;
            const setting = yield Setting_model_1.default.findOne();
            if (files && files["images"]) {
                if ((setting === null || setting === void 0 ? void 0 : setting.uploading_type) === constants_1.UploadingType.CLOUDINARY) {
                    // Cloudinary upload
                    for (const file of files["images"]) {
                        const result = yield cloudinary_config_1.default.uploader.upload(file.path, {
                            public_id: (0, slugify_1.default)(file.originalname),
                            folder: "loto", // Cloudinary folder name
                        });
                        images.push(result.secure_url);
                    }
                }
                else {
                    // Local server upload
                    images = files["images"].map((file) => `${process.env.IMAGE_PUBLIC_URL}${multer_config_1.FOLDER_NAME}${(0, slugify_1.default)(file.filename)}`);
                }
            }
            return res.status(200).json({ success: true, images });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error, try again!",
            });
        }
    }));
}));
// Controller function for single file upload
exports.uploadFile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, multer_config_1.singleUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            try {
                if (req.files &&
                    req.files.file) {
                    const fileArray = req.files.file;
                    let fileUrl = "";
                    const setting = yield Setting_model_1.default.findOne();
                    if ((setting === null || setting === void 0 ? void 0 : setting.uploading_type) === constants_1.UploadingType.CLOUDINARY) {
                        // Cloudinary upload
                        const result = yield cloudinary_config_1.default.uploader.upload(fileArray[0].path, {
                            public_id: (0, slugify_1.default)(fileArray[0].originalname),
                            folder: "loto", // Cloudinary folder name
                        });
                        fileUrl = result.secure_url;
                    }
                    else {
                        // Local server upload
                        fileUrl = `${process.env.IMAGE_PUBLIC_URL}${multer_config_1.FOLDER_NAME}${(0, slugify_1.default)(fileArray[0].filename)}`;
                    }
                    return res.status(200).json({ media: fileUrl, status: "success" });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: "No file uploaded" });
                }
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        }));
    }
    catch (err) {
        throw new Error(err.message || err);
    }
}));
