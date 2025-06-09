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
exports.deleteLottery = exports.updateLottery = exports.updateLotteryStatus = exports.updateLotteryWin = exports.updateLotteryIsBonus = exports.updateLotteryIsCoupon = exports.getLotteryTaskById = exports.getLotteryById = exports.createLottery = exports.getLotteryListByCat = exports.getFeatureLotteryList = exports.getAllSlotUser = exports.getAllLotteryUser = exports.getAllLottery = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Lottery_model_1 = __importDefault(require("../models/Lottery.model"));
const constants_1 = require("../constants");
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const MyLottery_model_1 = __importDefault(require("../models/MyLottery.model"));
// Get all rdata
exports.getAllLottery = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Lottery_model_1.default.find().populate("free_task");
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
exports.getAllLotteryUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Lottery_model_1.default.find({
            status: constants_1.LotteryStatus.ACTIVE,
        }, {
            name: 1,
            prize: 1,
            sell_close_date: 1,
            start_date: 1,
            result_date: 1,
            cross_price: 1,
            is_slot: 1,
            first_prize: 1,
            logo: 1,
            price: 1,
            slot_type: 1,
            limit: 1,
            is_free: 1,
        }).sort({ createdAt: -1 });
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
exports.getAllSlotUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slot = yield Lottery_model_1.default.find({
            status: constants_1.LotteryStatus.ACTIVE,
            is_slot: true,
        }, {
            name: 1,
            prize: 1,
            sell_close_date: 1,
            start_date: 1,
            result_date: 1,
            cross_price: 1,
            is_slot: 1,
            first_prize: 1,
            logo: 1,
            price: 1,
            slot_type: 1,
            limit: 1,
            is_free: 1,
        }).sort({ createdAt: -1 });
        // Promise.all का उपयोग करें ताकि सभी async operations resolve हों
        const result = yield Promise.all(slot.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const sold = yield MyLottery_model_1.default.find({
                lottery: item._id,
            }).countDocuments();
            return Object.assign(Object.assign({}, item.toObject()), { sell: sold });
        })));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: result,
            message: "Data retrieved successfully",
        });
    }
    catch (err) {
        next(err);
    }
}));
// Get feature rdata
exports.getFeatureLotteryList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rdata = yield Lottery_model_1.default.find({
            feature: true,
            status: constants_1.LotteryStatus.ACTIVE,
        }, { logo: 1, name: 1, title: 1, price: 1 }).populate("category", "name");
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
// Get Lottery by id rdata
exports.getLotteryListByCat = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Lottery_model_1.default.find({
            category: req.params.id,
            status: constants_1.LotteryStatus.ACTIVE,
        }, { logo: 1, name: 1, price: 1 });
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
exports.createLottery = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, banners, prize, price, logo, slot_type, cross_price, ticket, winning_note, winners, is_free, is_slot, first_prize, free_task, coupon_discount, bonus_discount, discount, limit, instant_win, start_date, result_date, sell_close_date, status, } = req.body;
    if (!name || !prize || !winners || !start_date || !result_date) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const rdata = yield Lottery_model_1.default.create({
            name,
            banners,
            prize,
            logo,
            price,
            cross_price,
            ticket,
            slot_type,
            winning_note,
            winners,
            is_free,
            is_slot,
            first_prize,
            free_task,
            coupon_discount,
            bonus_discount,
            discount,
            limit,
            instant_win,
            start_date,
            result_date,
            sell_close_date,
            status,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: rdata,
            message: "Lottery created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get rdata by ID
exports.getLotteryById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Lottery_model_1.default.findById(req.params.id);
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: rdata,
            message: "Lottery retrieved successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
exports.getLotteryTaskById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Lottery_model_1.default.findById(req.params.id, {
            free_task: 1,
        }).populate("free_task");
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: rdata,
            message: "Lottery retrieved successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
// Update rdata by ID
exports.updateLotteryIsCoupon = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { type } = req.body;
        const rdata = yield Lottery_model_1.default.findByIdAndUpdate(req.params.id, { coupon_discount: type }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "Lottery updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateLotteryIsBonus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { type } = req.body;
        const rdata = yield Lottery_model_1.default.findByIdAndUpdate(req.params.id, { bonus_discount: type }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "Lottery updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateLotteryWin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { type } = req.body;
        const rdata = yield Lottery_model_1.default.findByIdAndUpdate(req.params.id, { instant_win: type }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "Lottery updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateLotteryStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("Invalid status");
        }
        const rdata = yield Lottery_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "Lottery updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update rdata by ID
exports.updateLottery = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { name, banners, prize, logo, price, slot_type, cross_price, ticket, winning_note, winners, is_free, is_slot, first_prize, free_task, coupon_discount, bonus_discount, discount, limit, instant_win, start_date, result_date, sell_close_date, status, } = req.body;
    if (!name || !prize || !winners || !start_date || !result_date) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const rdata = yield Lottery_model_1.default.findByIdAndUpdate(req.params.id, {
            name,
            banners,
            prize,
            logo,
            price,
            slot_type,
            cross_price,
            ticket,
            winning_note,
            winners,
            is_free,
            is_slot,
            first_prize,
            free_task,
            coupon_discount,
            bonus_discount,
            discount,
            limit,
            instant_win,
            start_date,
            result_date,
            sell_close_date,
            status,
        }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: rdata,
            message: "Lottery updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete rdata by ID
exports.deleteLottery = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const rdata = yield Lottery_model_1.default.findByIdAndDelete(req.params.id);
        if (!rdata) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Lottery not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Lottery deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
