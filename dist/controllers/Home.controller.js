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
exports.deleteHome = exports.updateHome = exports.getHomeById = exports.createHome = exports.getAllHome = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Home_model_1 = __importDefault(require("../models/Home.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
// Get all data
exports.getAllHome = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Home_model_1.default.findOne();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Create a new data
exports.createHome = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { banners, telegram, social, how_to_play } = req.body;
    if (!banners || !telegram || !social || !how_to_play) {
        throw new errors_1.BadRequestError("banners, telegram, social, how_to_play and status must be provided");
    }
    try {
        const data = yield Home_model_1.default.create({
            banners,
            telegram,
            social,
            how_to_play,
            status: 1,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "Home created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get data by ID
exports.getHomeById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Home_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "Home not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "Home retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateHome = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Home_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Home not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Home updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete data by ID
exports.deleteHome = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Home_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Home not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Home deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
