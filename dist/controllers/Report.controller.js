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
exports.getRecentUsers = exports.getDashboardAnlytics = exports.getDashboardReport = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = __importDefault(require("../models/User.model"));
const http_status_codes_1 = require("http-status-codes");
const Conversion_model_1 = __importDefault(require("../models/Conversion.model"));
const Withdraw_model_1 = __importDefault(require("../models/Withdraw.model"));
const Click_model_1 = __importDefault(require("../models/Click.model"));
exports.getDashboardReport = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { startDate, endDate } = req.query;
    try {
        if (!startDate || !endDate) {
            const now = new Date();
            endDate = now.toISOString().split("T")[0]; // Today's date
            const pastWeek = new Date();
            pastWeek.setDate(now.getDate() - 7); // 7 days ago
            startDate = pastWeek.toISOString().split("T")[0]; // Start of the week
        }
        // Convert string dates to actual Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Ensure the end date includes the full day
        // Get total conversions within the date range
        const totalConversions = yield Conversion_model_1.default.countDocuments({
            createdAt: { $gte: start, $lte: end },
        });
        // Get total clicks within the date range
        const totalClicks = yield Click_model_1.default.countDocuments({
            createdAt: { $gte: start, $lte: end },
        });
        // Get total users created within the date range
        const totalUsers = yield User_model_1.default.countDocuments({
            createdAt: { $gte: start, $lte: end },
        });
        // Get total withdrawn amount within the date range
        const totalWithdrawAmount = yield Withdraw_model_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }, // Assuming "amount" is the field for withdrawn amounts
                },
            },
        ]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {
                conversions: totalConversions,
                clicks: totalClicks,
                users: totalUsers,
                withdrawAmount: ((_a = totalWithdrawAmount[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
            },
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.getDashboardAnlytics = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { startDate, endDate } = req.query;
    try {
        if (!startDate || !endDate) {
            const now = new Date();
            endDate = now.toISOString().split("T")[0]; // Today's date
            const pastWeek = new Date();
            pastWeek.setDate(now.getDate() - 7); // 7 days ago
            startDate = pastWeek.toISOString().split("T")[0]; // Start of the week
        }
        // Convert string dates to actual Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Ensure the end date includes the full day
        // Step 2: Fetch Clicks and Conversions grouped by date
        const clicksData = yield Click_model_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    clicks: { $sum: 1 },
                },
            },
        ]);
        const conversionsData = yield Conversion_model_1.default.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    conversions: { $sum: 1 },
                },
            },
        ]);
        const dateRange = [];
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            dateRange.push(new Date(d).toISOString().split("T")[0]); // Format: YYYY-MM-DD
        }
        // Step 3: Map data to the date range
        const chartData = dateRange.map((date) => {
            const clickEntry = clicksData.find((item) => item._id === date);
            const conversionEntry = conversionsData.find((item) => item._id === date);
            return {
                date,
                clicks: clickEntry ? clickEntry.clicks : 0,
                conversions: conversionEntry ? conversionEntry.conversions : 0,
            };
        });
        res.json({ success: true, data: chartData });
        return;
    }
    catch (error) {
        console.error("Error generating chart data:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
}));
exports.getRecentUsers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users registered in this month
        const users = yield User_model_1.default.find({}, { name: 1, email: 1, balance: 1, logo: 1 }).sort({ createdAt: -1 }).limit(10);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
}));
