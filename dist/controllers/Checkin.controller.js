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
exports.claimCheckin = exports.deleteCheckin = exports.updateCheckin = exports.updateCheckinStatus = exports.getCheckinById = exports.createCheckin = exports.getAllCheckinUser = exports.getAllCheckin = void 0;
const UserDailyCheckin_modal_1 = __importDefault(require("../models/UserDailyCheckin.modal"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Checkin_model_1 = __importDefault(require("../models/Checkin.model"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const validator_1 = __importDefault(require("../helpers/validator"));
const errors_1 = require("../errors");
const Coupon_model_1 = __importDefault(require("../models/Coupon.model"));
const helpers_1 = require("../helpers");
const User_model_1 = __importDefault(require("../models/User.model"));
const Bonus_model_1 = __importDefault(require("../models/Bonus.model"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
// export const getWeeklyCheckins = async (req: Request, res: Response) => {
//   try {
//     const weeklyCheckins = await WeeklyCheckin.find().populate("gifts.gift");
//     res.status(200).json(weeklyCheckins);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const createWeeklyCheckin = async (req: Request, res: Response) => {
//   try {
//     const { weekStart, gifts } = req.body; // Admin से weekStart date और gifts लेंगे
//     // Validate कि 7 गिफ्ट्स ही आए हैं
//     if (!gifts || gifts.length !== 7) {
//       return res
//         .status(400)
//         .json({ message: "हर दिन के लिए 7 गिफ्ट्स सेट करें।" });
//     }
//     // Validate कि gifts सही हैं
//     const giftIds = gifts.map((g: any) => g.gift);
//     const existingGifts = await Gift.find({ _id: { $in: giftIds } });
//     if (existingGifts.length !== 7) {
//       return res.status(400).json({ message: "कुछ गिफ्ट्स ID सही नहीं हैं।" });
//     }
//     // पहले से कोई वीक डेटा तो नहीं?
//     const existingWeek = await WeeklyCheckin.findOne({ weekStart });
//     if (existingWeek) {
//       return res.status(400).json({ message: "यह हफ्ता पहले से सेट है।" });
//     }
//     // नया वीक डेटा सेव करें
//     const newWeek = await WeeklyCheckin.create({ weekStart, gifts });
//     return res
//       .status(201)
//       .json({ message: "🎉 नया हफ्ता सेट कर दिया गया!", week: newWeek });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const deleteWeeklyCheckin = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await WeeklyCheckin.findByIdAndDelete(id);
//     res.status(200).json({ message: "Check-in Deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const checkIn = async (req: Request, res: Response) => {
//   try {
//     const userId = req?.user?._id; // User ID लें
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Midnight reset
//     // 🔹 हफ्ते की शुरुआत (Monday को सेट करें)
//     const weekStart = new Date(today);
//     weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday start
//     // 🔹 आज कौन-सा दिन है? (Monday = 1, Sunday = 7)
//     const todayDay = today.getDay() === 0 ? 7 : today.getDay();
//     // 🔹 Admin द्वारा सेट किए गए गिफ्ट्स को लाओ
//     const weeklyGifts = await WeeklyCheckin.findOne({ weekStart });
//     if (!weeklyGifts) {
//       return res
//         .status(400)
//         .json({ message: "इस हफ्ते के लिए गिफ्ट्स सेट नहीं हैं।" });
//     }
//     // 🔹 क्या आज के दिन का कोई गिफ्ट है?
//     const todayGiftData = weeklyGifts.gifts.find((g) => g.day === todayDay);
//     if (!todayGiftData) {
//       return res
//         .status(400)
//         .json({ message: "आज के लिए कोई गिफ्ट सेट नहीं है।" });
//     }
//     // 🔹 क्या User का चेक-इन डेटा पहले से मौजूद है?
//     let userCheckin = await UserCheckin.findOne({ user: userId, weekStart });
//     // 🔹 अगर चेक-इन डेटा नहीं है, तो नया बनाओ
//     if (!userCheckin) {
//       userCheckin = await UserCheckin.create({
//         user: userId,
//         weekStart,
//         checkins: [],
//       });
//     }
//     // 🔹 User के पास आज का गिफ्ट पहले से तो नहीं है?
//     const alreadyCollected = userCheckin.checkins.some(
//       (c) => c.day === todayDay && c.collected
//     );
//     if (alreadyCollected) {
//       return res
//         .status(400)
//         .json({ message: "आज का गिफ्ट पहले ही कलेक्ट हो चुका है।" });
//     }
//     // 🔹 पुराने दिन का गिफ्ट चेक करें (User सिर्फ आज का गिफ्ट ले सकता है)
//     const lastCheckinDay = userCheckin.checkins.length
//       ? Math.max(...userCheckin.checkins.map((c) => c.day))
//       : 0;
//     if (lastCheckinDay !== todayDay - 1) {
//       return res
//         .status(400)
//         .json({ message: "पिछले दिन का चेक-इन मिस हो गया, अब वह लॉक है।" });
//     }
//     // 🔹 आज का गिफ्ट सेव करें (Admin द्वारा अपडेट किया गया गिफ्ट ही मिलेगा)
//     userCheckin.checkins.push({
//       day: todayDay,
//       gift: todayGiftData.gift, // Updated gift
//       collected: true,
//     });
//     await userCheckin.save();
//     return res.status(200).json({
//       message: "🎉 Check-in successful!",
//       day: todayDay,
//       gift: todayGiftData.gift, // Updated gift
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getAllCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Checkin_model_1.default.find();
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
exports.getAllCheckinUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Checkin_model_1.default.find({ status: constants_1.Status.ACTIVE });
        const userCheckin = yield assignDailyCheckin({ user: req.user });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            userCheckin: userCheckin,
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
exports.createCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, prizeType, value, status } = req.body;
    if (!name || !prizeType || !value) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield Checkin_model_1.default.create({
            name,
            prizeType,
            value,
            status,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "Checkin created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get data by ID
exports.getCheckinById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Checkin_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Checkin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Checkin retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateCheckinStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("Invalid status");
        }
        const data = yield Checkin_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Checkin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Checkin updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { name, prizeType, value, status } = req.body;
    if (!name || !prizeType || !value) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield Checkin_model_1.default.findByIdAndUpdate(req.params.id, {
            name,
            prizeType,
            value,
            status,
        }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Checkin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Checkin updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete data by ID
exports.deleteCheckin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Checkin_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Checkin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Checkin deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
const getMondayIST = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 330); // UTC से 5:30 घंटे जोड़ो (IST के लिए)
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1); // इस हफ्ते का सोमवार
    monday.setUTCHours(18, 30, 0, 0); // 00:00:00 IST
    return monday;
};
const assignDailyCheckin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
    try {
        const userId = user._id;
        const today = new Date();
        today.setMinutes(today.getMinutes() + 330); // IST में कन्वर्ट करो
        today.setUTCHours(18, 30, 0, 0); // 00:00:00 IST // समय हटाकर सिर्फ तारीख रखें
        // today.setHours(0, 0, 0, 0); // समय हटाकर सिर्फ तारीख रखें
        const monday = getMondayIST(); // IST के अनुसार सही सोमवार
        const existingCheckin = yield UserDailyCheckin_modal_1.default.findOne({ user: userId });
        let userCheckin = existingCheckin;
        if (!existingCheckin ||
            new Date(existingCheckin.startDate).getTime() < monday.getTime()) {
            // **नया सप्ताह शुरू करें या पहली बार रिकॉर्ड बनाएं**
            const spins = Array(7)
                .fill(null)
                .map((_, i) => {
                const date = new Date(monday.getTime() + i * 86400000); // सोमवार से रविवार तक की डेट्स निकालो
                // console.log(date);
                return {
                    date,
                    status: date < today ? "ABSENT" : "PENDING",
                };
            });
            userCheckin = yield UserDailyCheckin_modal_1.default.findOneAndUpdate({ user: userId }, { $set: { spins, startDate: monday } }, { upsert: true, new: true });
        }
        else {
            // **अगर पहले से डेटा है, तो "ABSENT" अपडेट करो**
            userCheckin = yield UserDailyCheckin_modal_1.default.findOneAndUpdate({
                user: userId,
                "spins.status": "PENDING",
                "spins.date": { $lt: today },
            }, { $set: { "spins.$.status": "ABSENT" } }, { new: true });
        }
        if (!userCheckin) {
            userCheckin = yield UserDailyCheckin_modal_1.default.findOne({ user: userId });
        }
        return userCheckin === null || userCheckin === void 0 ? void 0 : userCheckin.spins;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
const claimCheckin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setMinutes(today.getMinutes() + 330); // **IST में कन्वर्ट करें**
        today.setUTCHours(18, 30, 0, 0); // 00:00:00 IST // **सिर्फ तारीख रखें**
        const userCheckin = yield UserDailyCheckin_modal_1.default.findOne({ user: userId });
        if (!userCheckin) {
            return res
                .status(404)
                .json({ success: false, message: "Checkin record not found" });
        }
        console.log("userCheckin", userCheckin);
        // ✅ **आज के स्पिन को खोजो (IST डेट से कंपेयर)**
        const todayCheckin = userCheckin.spins.find((spin) => new Date(spin.date).toLocaleDateString("en-GB") ===
            today.toLocaleDateString("en-GB"));
        console.log("todayCheckin", todayCheckin);
        if (!todayCheckin) {
            return res
                .status(400)
                .json({ success: false, message: "No spin available for today" });
        }
        if (todayCheckin.status !== "PENDING") {
            return res
                .status(400)
                .json({ success: false, message: "Checkin already used or absent" });
        }
        // ✅ **आज कौन सा दिन है?**
        const spinIndex = userCheckin.spins.findIndex((spin) => new Date(spin.date).toLocaleDateString("en-GB") ===
            today.toLocaleDateString("en-GB"));
        const isSeventhDay = spinIndex === 6; // **7वां दिन**
        // ✅ **स्पिन के लिए प्राइज़ तय करें**
        const prizeTypes = isSeventhDay
            ? [constants_1.PrizeName.BONUS] // **7वें दिन सिर्फ BONUS**
            : [
                constants_1.PrizeName.ADD_CASH,
                constants_1.PrizeName.BUY_LOTTERY,
                constants_1.PrizeName.FREE_LOTTERY,
                constants_1.PrizeName.TRY_AGAIN,
                constants_1.PrizeName.BETTER_LUCK,
            ];
        const spinQuery = {
            prizeType: { $in: prizeTypes },
            status: constants_1.Status.ACTIVE,
        };
        if (!isSeventhDay) {
            spinQuery.value = { $lte: 50 };
        }
        const winningCheckin = yield Checkin_model_1.default.aggregate([
            { $match: spinQuery },
            { $sample: { size: 1 } }, // **रैंडम स्पिन चुनो**
        ]);
        if (!winningCheckin.length) {
            return res
                .status(400)
                .json({ success: false, message: "No valid spin found" });
        }
        // ✅ **स्पिन जीतने का लॉजिक**
        const winningPrizeType = winningCheckin[0].prizeType;
        let reward = null;
        switch (winningPrizeType) {
            case constants_1.PrizeName.ADD_CASH:
                reward = yield generateDepositCoupon({
                    value: winningCheckin[0].value,
                    user: userId,
                });
                break;
            case constants_1.PrizeName.BUY_LOTTERY:
            case constants_1.PrizeName.FREE_LOTTERY:
                reward = yield generateLotteryCoupon({
                    value: winningCheckin[0].value,
                    user: userId,
                });
                break;
            case constants_1.PrizeName.BONUS:
                reward = yield generateBonus({
                    value: winningCheckin[0].value,
                    user: userId,
                });
                break;
            default:
                break;
        }
        // ✅ **आज का स्पिन अपडेट करें**
        if (winningPrizeType !== constants_1.PrizeName.TRY_AGAIN) {
            yield UserDailyCheckin_modal_1.default.findOneAndUpdate({ user: userId, "spins.date": today }, {
                $set: {
                    "spins.$.status": "COMPLETED",
                    "spins.$.reward": winningCheckin[0]._id,
                },
            }, { new: true });
        }
        const userCheckinData = yield assignDailyCheckin({ user: req.user });
        return res.status(200).json({
            success: true,
            message: "Checkin claimed successfully!",
            data: winningCheckin[0], // **यूज़र को उसका रिवॉर्ड भी दिखाएं**
            reward,
            userCheckin: userCheckinData,
        });
    }
    catch (error) {
        console.error("Error claiming spin:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.claimCheckin = claimCheckin;
const generateDepositCoupon = (_a) => __awaiter(void 0, [_a], void 0, function* ({ value, user, }) {
    try {
        const data = yield Coupon_model_1.default.create({
            name: "Checkin Coupon",
            code: (0, helpers_1.generateCouponCode)("CK"),
            type: constants_1.CouponType.DEPOSIT,
            c_type: constants_1.OfferType.AMOUNT,
            value: value,
            min_value: 1,
            limit: 1,
            user: user,
            status: constants_1.Status.ACTIVE,
        });
        return data.code;
    }
    catch (error) {
        return false;
    }
});
const generateLotteryCoupon = (_a) => __awaiter(void 0, [_a], void 0, function* ({ value, user, }) {
    try {
        const data = yield Coupon_model_1.default.create({
            name: "Checkin Coupon",
            code: (0, helpers_1.generateCouponCode)("SP"),
            type: constants_1.CouponType.LOTTERY,
            c_type: constants_1.OfferType.AMOUNT,
            value: value,
            min_value: 1,
            limit: 1,
            user: user,
            status: constants_1.Status.ACTIVE,
        });
        return data.code;
    }
    catch (error) {
        return false;
    }
});
const generateBonus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ value, user }) {
    try {
        const userData = yield User_model_1.default.findOne({ _id: user, status: constants_1.Status.ACTIVE });
        if (!userData)
            return false;
        const bonusAmount = Math.floor(Math.random() * value);
        const bonus = new Bonus_model_1.default({
            user: user,
            amount: bonusAmount,
            order_id: (0, helpers_1.generateOrderId)("CK"), // generate a unique order ID
            from: user === null || user === void 0 ? void 0 : user.name,
            type: constants_1.BonusType.CHECK,
            details: `Checkin Bonus`,
            date: new Date(),
            status: constants_1.Status.ACTIVE,
        });
        yield bonus.save();
        const transaction = new Transaction_model_1.default({
            user: user,
            order_id: bonus.order_id,
            amount: bonusAmount,
            type: constants_1.TransactionType.CREDIT,
            details: `Checkin Bonus`,
            status: constants_1.TransactionStatus.APPROVED,
        });
        yield transaction.save();
        userData.bonus += bonusAmount;
        yield userData.save();
        return bonusAmount;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
