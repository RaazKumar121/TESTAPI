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
exports.deleteOffer = exports.updateOffer = exports.updateOfferStatus = exports.getOfferById = exports.createOffer = exports.getAllOfferUser = exports.getAllOffer = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Offer_model_1 = __importDefault(require("../models/Offer.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
// Get all data
exports.getAllOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Offer_model_1.default.find();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        // console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
exports.getAllOfferUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const data = yield Offer_model_1.default.find(Object.assign({ status: constants_1.Status.ACTIVE }, query));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        // console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Create a new data
exports.createOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.exclude_lottery) {
        req.body.exclude_lottery = null; // खाली user को null में बदलें
    }
    const { name, desc, code, mode, type, value, min_value, limit, exclude_lottery, status, } = req.body;
    if (!name || !limit || !value || !type) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield Offer_model_1.default.create({
            name,
            desc,
            code,
            mode,
            type,
            value,
            min_value,
            limit,
            exclude_lottery,
            status,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "Offer created successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
// Get data by ID
exports.getOfferById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Offer_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Offer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Offer retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateOfferStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("Invalid status");
        }
        const data = yield Offer_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Offer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Offer updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    if (!req.body.exclude_lottery) {
        req.body.exclude_lottery = null; // खाली user को null में बदलें
    }
    const { name, desc, mode, code, type, value, min_value, limit, exclude_lottery, status, } = req.body;
    if (!name || !limit || !value || !type) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield Offer_model_1.default.findByIdAndUpdate(req.params.id, {
            name,
            desc,
            mode,
            code,
            type,
            value,
            min_value,
            limit,
            exclude_lottery,
            status,
        }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Offer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Offer updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete data by ID
exports.deleteOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Offer_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Offer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Offer deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
