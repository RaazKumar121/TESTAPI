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
exports.getMyDeposit = exports.deleteDeposit = exports.updateDeposit = exports.updateDepositStatus = exports.getDepositById = exports.getPendingDeposit = exports.getAllDeposit = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Deposit_model_1 = __importDefault(require("../models/Deposit.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("../helpers");
const Bonus_model_1 = __importDefault(require("../models/Bonus.model"));
const deposit_1 = require("../helpers/deposit");
// Get all ad
exports.getAllDeposit = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield Deposit_model_1.default.find()
            .populate("user", "name email logo status")
            .sort({ createdAt: -1 });
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
exports.getPendingDeposit = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield Deposit_model_1.default.find({
            status: constants_1.TransactionStatus.PENDING,
        })
            .populate("user", "name email logo status")
            .sort({ createdAt: -1 });
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
// Get ad by ID
exports.getDepositById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    (0, validator_1.default)(req.params.id);
    try {
        const ad = yield Deposit_model_1.default.findById(req.params.id).populate("user", "name id logo email balance");
        const data = {
            user: {
                name: (_a = ad === null || ad === void 0 ? void 0 : ad.user) === null || _a === void 0 ? void 0 : _a.name,
                id: (_b = ad === null || ad === void 0 ? void 0 : ad.user) === null || _b === void 0 ? void 0 : _b._id,
                logo: (_c = ad === null || ad === void 0 ? void 0 : ad.user) === null || _c === void 0 ? void 0 : _c.logo,
                email: (_d = ad === null || ad === void 0 ? void 0 : ad.user) === null || _d === void 0 ? void 0 : _d.email,
                balance: (_e = ad === null || ad === void 0 ? void 0 : ad.user) === null || _e === void 0 ? void 0 : _e.balance,
                totalCashOut: yield (0, helpers_1.getUserCashout)((_f = ad === null || ad === void 0 ? void 0 : ad.user) === null || _f === void 0 ? void 0 : _f.id),
                totalDeposit: yield (0, helpers_1.getUserDeposit)((_g = ad === null || ad === void 0 ? void 0 : ad.user) === null || _g === void 0 ? void 0 : _g.id),
            },
            order_id: ad === null || ad === void 0 ? void 0 : ad.order_id,
            amount: ad === null || ad === void 0 ? void 0 : ad.amount,
            type: ad === null || ad === void 0 ? void 0 : ad.type,
            details: ad === null || ad === void 0 ? void 0 : ad.details,
            payment_details: ad === null || ad === void 0 ? void 0 : ad.payment_details,
            status: ad === null || ad === void 0 ? void 0 : ad.status,
            createdAt: ad === null || ad === void 0 ? void 0 : ad.createdAt,
        };
        if (!ad) {
            res.status(404).json({
                success: false,
                message: "Deposit not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "Deposit retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update ad by ID
exports.updateDepositStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // Deposit ID URL me milega
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
        const deposit = yield Deposit_model_1.default.findById(id);
        if (!deposit) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Deposit request not found" });
            return;
        }
        if ((deposit === null || deposit === void 0 ? void 0 : deposit.status) === constants_1.TransactionStatus.APPROVED) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Deposit already accepted" });
            return;
        }
        // Transaction model se transaction find karein using order_id
        const transaction = yield Transaction_model_1.default.findOne({
            order_id: deposit.order_id,
        });
        const referTransaction = yield Transaction_model_1.default.findOne({
            order_id: deposit.order_id.replace(/^DP-/, "REF-"),
            status: constants_1.TransactionStatus.PENDING,
        });
        const bonus = yield Bonus_model_1.default.findOne({
            order_id: referTransaction === null || referTransaction === void 0 ? void 0 : referTransaction.order_id,
            status: constants_1.TransactionStatus.PENDING,
        });
        if (!transaction) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Transaction not found" });
            return;
        }
        const user = yield User_model_1.default.findById(deposit.user);
        if (!user) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "User not found" });
            return;
        }
        if (status == constants_1.TransactionStatus.APPROVED) {
            // Success case
            deposit.status = constants_1.TransactionStatus.APPROVED;
            transaction.status = constants_1.TransactionStatus.APPROVED;
            user.deposit += deposit.amount + deposit.bonus;
            yield deposit.save();
            yield transaction.save();
            yield user.save();
            if (referTransaction) {
                const isValid = yield (0, deposit_1.referBonusDeposit)({
                    amount: deposit.amount,
                    referer: referTransaction === null || referTransaction === void 0 ? void 0 : referTransaction.user,
                    user: user,
                });
                referTransaction.status = constants_1.TransactionStatus.APPROVED;
                bonus.status = constants_1.TransactionStatus.APPROVED;
                yield referTransaction.save();
                yield bonus.save();
                const referer = yield User_model_1.default.findById(referTransaction.user);
                if (referer) {
                    referer.bonus += referTransaction.amount;
                    yield referer.save();
                }
            }
            res
                .status(http_status_codes_1.StatusCodes.ACCEPTED)
                .json({ success: true, message: "Deposit approved successfully" });
            return;
        }
        else if (status == constants_1.TransactionStatus.REJECTED) {
            // Failed case
            deposit.status = constants_1.TransactionStatus.REJECTED;
            transaction.status = constants_1.TransactionStatus.REJECTED;
            // Withdrawn amount user ke balance me add karein
            yield deposit.save();
            yield transaction.save();
            if (referTransaction) {
                referTransaction.status = constants_1.TransactionStatus.REJECTED;
                yield referTransaction.save();
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                success: true,
                message: "Deposit rejected and amount refunded successfully",
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
        console.error("Error updating deposit status:", error);
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
exports.updateDeposit = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const ad = yield Deposit_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!ad) {
            res.status(404).json({
                success: false,
                message: "Deposit not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: ad,
            message: "Deposit updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete ad by ID
exports.deleteDeposit = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const ad = yield Deposit_model_1.default.findByIdAndDelete(req.params.id);
        if (!ad) {
            res.status(404).json({
                success: false,
                message: "Deposit not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Deposit deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
exports.getMyDeposit = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield Deposit_model_1.default.find({ user: req.user }).sort({
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
