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
exports.deleteWeeklyCheckin = exports.updateWeeklyCheckin = exports.getWeeklyCheckinById = exports.createWeeklyCheckin = exports.getWeeklyCheckinUser = exports.getAllWeeklyCheckin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const WeeklyCheckin_model_1 = __importDefault(require("../models/WeeklyCheckin.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
// Get all data
exports.getAllWeeklyCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield WeeklyCheckin_model_1.default.find().populate({
            path: "gifts.gift",
            model: "giftes", // Ensure correct model name
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
exports.getWeeklyCheckinUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Midnight reset
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const data = yield WeeklyCheckin_model_1.default.findOne({ weekStart });
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
// Create a new WeeklyCheckin
exports.createWeeklyCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekStart, gifts } = req.body;
    if (!gifts || gifts.length !== 7) {
        throw new errors_1.BadRequestError("all fields are required");
    }
    try {
        const existingWeek = yield WeeklyCheckin_model_1.default.findOne({ weekStart });
        if (existingWeek) {
            throw new errors_1.BadRequestError("week already exists");
        }
        const data = yield WeeklyCheckin_model_1.default.create({ weekStart, gifts });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "WeeklyCheckin created successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
// Get WeeklyCheckin by ID
exports.getWeeklyCheckinById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield WeeklyCheckin_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "WeeklyCheckin not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "WeeklyCheckin retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update WeeklyCheckin by ID
exports.updateWeeklyCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield WeeklyCheckin_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "WeeklyCheckin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "WeeklyCheckin updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete WeeklyCheckin by ID
exports.deleteWeeklyCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield WeeklyCheckin_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "WeeklyCheckin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "WeeklyCheckin deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
