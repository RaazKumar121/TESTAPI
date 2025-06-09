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
exports.deleteTask = exports.updateTask = exports.updateTaskStatus = exports.getTaskById = exports.createTask = exports.getAllTaskUser = exports.getAllTask = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Task_model_1 = __importDefault(require("../models/Task.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
// Get all categories
exports.getAllTask = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Task_model_1.default.find();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: categories,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
exports.getAllTaskUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Task_model_1.default.find({ status: constants_1.OfferStatus.ACTIVE });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: categories,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Create a new Task
exports.createTask = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, task, status } = req.body;
    if (!name || !status || !task) {
        throw new errors_1.BadRequestError("name and status must be provided");
    }
    try {
        const data = yield Task_model_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "Task created successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
// Get Task by ID
exports.getTaskById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Task_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "Task retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update Task Status
exports.updateTaskStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { status } = req.body;
    if (!status) {
        throw new errors_1.BadRequestError("status must be provided");
    }
    try {
        const data = yield Task_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Task updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update Task by ID
exports.updateTask = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Task_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Task updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete Task by ID
exports.deleteTask = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Task_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Task deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
