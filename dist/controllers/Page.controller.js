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
exports.deletePage = exports.updatePage = exports.getPageById = exports.createPage = exports.getAllPage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Page_model_1 = __importDefault(require("../models/Page.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
// Get all rdata
exports.getAllPage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Page_model_1.default.findOne();
        res.status(200).json({
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
exports.createPage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Page_model_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: rdata,
            message: "Page created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get rdata by ID
exports.getPageById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Page_model_1.default.findById(req.params.id);
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Page not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: rdata,
            message: "Page retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updatePage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Page_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Page not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: rdata,
            message: "Page updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete rdata by ID
exports.deletePage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Page_model_1.default.findByIdAndDelete(req.params.id);
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Page not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Page deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
