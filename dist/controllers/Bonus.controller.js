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
exports.getMyBonus = exports.deleteBonus = exports.updateBonus = exports.updateBonusStatus = exports.getBonusById = exports.createBonus = exports.getAllBonus = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Bonus_model_1 = __importDefault(require("../models/Bonus.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
// Get all data
exports.getAllBonus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Bonus_model_1.default.find().populate("user", "name logo email");
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
// Create a new category
exports.createBonus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, status } = req.body;
    if (!name || !status) {
        throw new errors_1.BadRequestError("name and status must be provided");
    }
    try {
        const category = yield Bonus_model_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: category,
            message: "Bonus created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get category by ID
exports.getBonusById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const category = yield Bonus_model_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Bonus not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: category,
            message: "Bonus retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update category Status
exports.updateBonusStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { status } = req.body;
    if (!status) {
        throw new errors_1.BadRequestError("status must be provided");
    }
    try {
        const category = yield Bonus_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!category) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Bonus not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: category,
            message: "Bonus updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update category by ID
exports.updateBonus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const category = yield Bonus_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!category) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Bonus not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: category,
            message: "Bonus updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete category by ID
exports.deleteBonus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const category = yield Bonus_model_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Bonus not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Bonus deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
exports.getMyBonus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield Bonus_model_1.default.find({ user: req.user }).sort({
            createdAt: -1,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: ad,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
