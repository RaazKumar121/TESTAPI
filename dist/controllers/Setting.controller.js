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
exports.deleteSetting = exports.updateSetting = exports.getSettingById = exports.createSetting = exports.getAllSetting = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
// Get all rdata
exports.getAllSetting = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Setting_model_1.default.findOne();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: rdata,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Create a new rdata
exports.createSetting = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Setting_model_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: rdata,
            message: "Setting created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get rdata by ID
exports.getSettingById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Setting_model_1.default.findById(req.params.id);
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Setting not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: rdata,
            message: "Setting retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateSetting = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Setting_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Setting not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "Setting updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete rdata by ID
exports.deleteSetting = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Setting_model_1.default.findByIdAndDelete(req.params.id);
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Setting not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Setting deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
