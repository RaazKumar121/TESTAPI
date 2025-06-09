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
exports.updateConversionStatus = exports.getConversionById = exports.getPendingConversion = exports.getAllConversion = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Conversion_model_1 = __importDefault(require("../models/Conversion.model"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const validator_1 = __importDefault(require("../helpers/validator"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.getAllConversion = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Conversion_model_1.default.find()
            .populate("user", "email name")
            .populate("offer", "name logo");
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
exports.getPendingConversion = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Conversion_model_1.default.find({
            status: constants_1.ConversionStatus.PENDING,
        })
            .populate("user", "email name")
            .populate("offer", "name logo");
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
exports.getConversionById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    // console.log(req.params.id);
    try {
        const rdata = yield Conversion_model_1.default.findById(req.params.id)
            .populate("user")
            .populate("offer")
            .populate("click");
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: rdata,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        // console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
exports.updateConversionStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // Withdraw ID URL me milega
    const status = Number((_a = req.body) === null || _a === void 0 ? void 0 : _a.status);
    (0, validator_1.default)(id);
    // console.log(Number(status));
    if (!status || !id) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "please send a valid data",
        });
        return;
    }
    try {
        // Withdraw model se withdraw record fetch karein
        const conversion = yield Conversion_model_1.default.findById(id);
        if (!conversion) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "conversion request not found" });
            return;
        }
        if (conversion.status === constants_1.ConversionStatus.APPROVED) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                .json({ success: false, message: "conversion already accepted" });
            return;
        }
        // Transaction model se transaction find karein using order_id
        const transaction = yield Transaction_model_1.default.findOne({
            order_id: `CB_${conversion._id}`,
        });
        if (!transaction) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Transaction not found" });
            return;
        }
        if (status == constants_1.ConversionStatus.APPROVED) {
            // Success case
            yield User_model_1.default.findByIdAndUpdate(conversion === null || conversion === void 0 ? void 0 : conversion.user, {
                $inc: {
                    balance: conversion === null || conversion === void 0 ? void 0 : conversion.payout,
                },
            }, // Increment user's balance by bonusAmount
            { new: true });
            conversion.status = constants_1.ConversionStatus.APPROVED;
            transaction.status = constants_1.ConversionStatus.APPROVED;
            yield conversion.save();
            yield transaction.save();
            res
                .status(http_status_codes_1.StatusCodes.ACCEPTED)
                .json({ success: true, message: "Conversion approved successfully" });
            return;
        }
        else if (status == constants_1.ConversionStatus.REJECTED) {
            // Failed case
            conversion.status = constants_1.ConversionStatus.REJECTED;
            transaction.status = constants_1.ConversionStatus.REJECTED;
            yield conversion.save();
            yield transaction.save();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                success: true,
                message: "Conversion rejected successfully",
            });
            return;
        }
        else {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Invalid status" });
            return;
        }
    }
    catch (error) {
        console.error("Error updating withdraw status:", error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Validation error",
                details: error.errors,
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message || "Unknown error",
        });
        next(error);
    }
}));
