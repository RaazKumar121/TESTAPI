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
exports.deleteDepositOffer = exports.updateDepositOffer = exports.updateDepositOfferStatus = exports.getDepositOfferById = exports.createDepositOffer = exports.getAllDepositOfferUser = exports.getAllDepositOffer = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const DepositOffer_model_1 = __importDefault(require("../models/DepositOffer.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
// Get all rdata
exports.getAllDepositOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield DepositOffer_model_1.default.find();
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
exports.getAllDepositOfferUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield DepositOffer_model_1.default.find({ status: constants_1.Status.ACTIVE });
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
// Create a new rdata
exports.createDepositOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, desc, value, limit, status } = req.body;
    if (!name || !limit || !value) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const rdata = yield DepositOffer_model_1.default.create({
            name,
            desc,
            value,
            limit,
            status,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: rdata,
            message: "DepositOffer created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get rdata by ID
exports.getDepositOfferById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield DepositOffer_model_1.default.findById(req.params.id);
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "DepositOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: rdata,
            message: "DepositOffer retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateDepositOfferStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("Invalid status");
        }
        const rdata = yield DepositOffer_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "DepositOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "DepositOffer updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateDepositOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { name, desc, value, limit, status } = req.body;
    if (!name || !limit || !value) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const rdata = yield DepositOffer_model_1.default.findByIdAndUpdate(req.params.id, {
            name,
            desc,
            value,
            limit,
            status,
        }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "DepositOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "DepositOffer updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete rdata by ID
exports.deleteDepositOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield DepositOffer_model_1.default.findByIdAndDelete(req.params.id);
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "DepositOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "DepositOffer deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
