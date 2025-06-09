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
exports.getMyWithdraw = exports.deleteWithdraw = exports.updateWithdraw = exports.updateWithdrawStatus = exports.getWithdrawById = exports.getPendingWithdraw = exports.getAllWithdraw = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Withdraw_model_1 = __importDefault(require("../models/Withdraw.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("../helpers");
// Get all rdata
exports.getAllWithdraw = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Withdraw_model_1.default.find()
            .populate("user", "name email logo status")
            .sort({ createdAt: -1 });
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
exports.getPendingWithdraw = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Withdraw_model_1.default.find({
            status: constants_1.WithdrawStatus.PENDING,
        })
            .populate("user", "name email logo status")
            .sort({ createdAt: -1 });
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
// export const createWithdraw = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const rdata = await Withdraw.create(req.body);
//       res.status(201).json({
//         success: true,
//         data: rdata,
//         message: "Withdraw created successfully",
//       });
//       return;
//     } catch (err: any) {
//       next(err);
//     }
//   }
// );
// Get rdata by ID
exports.getWithdrawById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Withdraw_model_1.default.findById(req.params.id).populate("user", "name id logo email balance");
        const data = {
            user: {
                name: (_a = rdata === null || rdata === void 0 ? void 0 : rdata.user) === null || _a === void 0 ? void 0 : _a.name,
                id: (_b = rdata === null || rdata === void 0 ? void 0 : rdata.user) === null || _b === void 0 ? void 0 : _b._id,
                logo: (_c = rdata === null || rdata === void 0 ? void 0 : rdata.user) === null || _c === void 0 ? void 0 : _c.logo,
                email: (_d = rdata === null || rdata === void 0 ? void 0 : rdata.user) === null || _d === void 0 ? void 0 : _d.email,
                balance: (_e = rdata === null || rdata === void 0 ? void 0 : rdata.user) === null || _e === void 0 ? void 0 : _e.balance,
                totalCashOut: yield (0, helpers_1.getUserCashout)((_f = rdata === null || rdata === void 0 ? void 0 : rdata.user) === null || _f === void 0 ? void 0 : _f.id),
            },
            order_id: rdata === null || rdata === void 0 ? void 0 : rdata.order_id,
            amount: rdata === null || rdata === void 0 ? void 0 : rdata.amount,
            type: rdata === null || rdata === void 0 ? void 0 : rdata.type,
            details: rdata === null || rdata === void 0 ? void 0 : rdata.details,
            payment_details: rdata === null || rdata === void 0 ? void 0 : rdata.payment_details,
            status: rdata === null || rdata === void 0 ? void 0 : rdata.status,
            createdAt: rdata === null || rdata === void 0 ? void 0 : rdata.createdAt,
        };
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Withdraw not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "Withdraw retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateWithdrawStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const withdraw = yield Withdraw_model_1.default.findById(id);
        if (!withdraw) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Withdraw request not found" });
            return;
        }
        if ((withdraw === null || withdraw === void 0 ? void 0 : withdraw.status) === constants_1.WithdrawStatus.APPROVED) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Withdraw already accepted" });
            return;
        }
        // Transaction model se transaction find karein using order_id
        const transaction = yield Transaction_model_1.default.findOne({
            order_id: withdraw.order_id,
        });
        if (!transaction) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Transaction not found" });
            return;
        }
        const user = yield User_model_1.default.findById(withdraw.user);
        if (!user) {
            res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "User not found" });
            return;
        }
        if (status == constants_1.WithdrawStatus.APPROVED) {
            // Success case
            withdraw.status = constants_1.WithdrawStatus.APPROVED;
            transaction.status = constants_1.WithdrawStatus.APPROVED;
            yield withdraw.save();
            yield transaction.save();
            res
                .status(http_status_codes_1.StatusCodes.ACCEPTED)
                .json({ success: true, message: "Withdraw approved successfully" });
            return;
        }
        else if (status == constants_1.WithdrawStatus.REJECTED) {
            // Failed case
            withdraw.status = constants_1.WithdrawStatus.REJECTED;
            transaction.status = constants_1.WithdrawStatus.REJECTED;
            // Withdrawn amount user ke balance me add karein
            user.balance += withdraw.amount;
            // Refund transaction entry
            const refundTransaction = new Transaction_model_1.default({
                user: user,
                order_id: `RF-${withdraw.order_id.split("WD-")[1]}`,
                amount: withdraw.amount,
                type: constants_1.TransactionType.CREDIT,
                // details: `Refund of ₹ ${withdraw.amount} for failed withdraw, Order ID: ${withdraw.order_id}`,
                details: `Refund of ₹ ${withdraw.amount}`,
                status: constants_1.TransactionStatus.APPROVED,
            });
            yield withdraw.save();
            yield transaction.save();
            yield user.save();
            yield refundTransaction.save();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                success: true,
                message: "Withdraw rejected and amount refunded successfully",
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
exports.updateWithdraw = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Withdraw_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Withdraw not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: rdata,
            message: "Withdraw updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete rdata by ID
exports.deleteWithdraw = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Withdraw_model_1.default.findByIdAndDelete(req.params.id);
        if (!rdata) {
            res.status(404).json({
                success: false,
                message: "Withdraw not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Withdraw deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
exports.getMyWithdraw = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield Withdraw_model_1.default.find({ user: req.user })
            .populate("bank", "name")
            .sort({
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
        console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
