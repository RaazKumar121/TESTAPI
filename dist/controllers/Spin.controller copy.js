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
exports.claimSpin = exports.deleteSpin = exports.updateSpin = exports.updateSpinStatus = exports.getSpinById = exports.createSpin = exports.getSpinResult = exports.getAllSpinUser = exports.getAllSpin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Spin_model_1 = __importDefault(require("../models/Spin.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
const UserSpin_modal_1 = __importDefault(require("../models/UserSpin.modal"));
const Coupon_model_1 = __importDefault(require("../models/Coupon.model"));
const helpers_1 = require("../helpers");
const User_model_1 = __importDefault(require("../models/User.model"));
const Bonus_model_1 = __importDefault(require("../models/Bonus.model"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
// Get all data
exports.getAllSpin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Spin_model_1.default.find();
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
exports.getAllSpinUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Spin_model_1.default.find({ status: constants_1.Status.ACTIVE });
        const userSpin = yield assignDailySpin({ user: req.user });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            userSpin: userSpin,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        // console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
exports.getSpinResult = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {
            value: { $lte: 50 }, // 50 या उससे कम
            prizeType: {
                $in: [
                    constants_1.PrizeName.ADD_CASH,
                    constants_1.PrizeName.BUY_LOTTERY,
                    constants_1.PrizeName.FREE_LOTTERY,
                    constants_1.PrizeName.TRY_AGAIN,
                    constants_1.PrizeName.BETTER_LUCK,
                    constants_1.PrizeName.BONUS,
                ],
            },
            status: constants_1.Status.ACTIVE,
        };
        const data = yield Spin_model_1.default.find(filter);
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
exports.createSpin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, prizeType, value, status } = req.body;
    if (!name || !prizeType || !value) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield Spin_model_1.default.create({
            name,
            prizeType,
            value,
            status,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "Spin created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get data by ID
exports.getSpinById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Spin_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Spin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Spin retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateSpinStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("Invalid status");
        }
        const data = yield Spin_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Spin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Spin updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateSpin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { name, prizeType, value, status } = req.body;
    if (!name || !prizeType || !value) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield Spin_model_1.default.findByIdAndUpdate(req.params.id, {
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
                message: "Spin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "Spin updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete data by ID
exports.deleteSpin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield Spin_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Spin not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Spin deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// export const assignDailySpin = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user._id;
//       const today = new Date();
//       const monday = new Date();
//       monday.setDate(today.getDate() - today.getDay() + 1); // इस हफ्ते का सोमवार
//       let userSpin = await UserSpin.findOne({ userId });
//       // **अगर यूजर का स्पिन रिकॉर्ड नहीं है, तो नया बनाए**
//       if (!userSpin) {
//         const spins = Array(7)
//           .fill(null)
//           .map((_, i) => ({
//             date: new Date(monday.getTime() + i * 86400000), // हर दिन का रिकॉर्ड
//             status: "PENDING",
//           }));
//         userSpin = new UserSpin({
//           userId,
//           spins,
//           startDate: monday,
//         });
//         await userSpin.save();
//       }
//       res.status(200).json({ success: true, data: userSpin });
//       return;
//     } catch (error) {
//       console.error("Error assigning daily spin:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//       return;
//     }
//   }
// );
// const assignDailySpin = async ({ user }: { user: any }) => {
//   try {
//     const userId = user._id;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // समय हटाकर सिर्फ तारीख रखें
//     // **इस हफ्ते का सही सोमवार निकालो**
//     const monday = new Date(today);
//     monday.setDate(today.getDate() - today.getDay() + 1); // इस हफ्ते का सोमवार (24/03/2025)
//     // **अगर आज रविवार (30/03/2025) है, तो हमें अगले सोमवार से स्टार्ट करना चाहिए**
//     if (today.getDay() === 0) {
//       monday.setDate(monday.getDate() - 7 + 1); // पिछला सोमवार नहीं, बल्कि सही सोमवार (24/03/2025)
//     }
//     let userSpin = await UserSpin.findOne({ user: userId });
//     console.log("monday", monday);
//     console.log("startDate", new Date(userSpin!.startDate));
//     // **अगर यूजर का स्पिन रिकॉर्ड नहीं है, तो नया बनाए**
//     if (!userSpin) {
//       const spins = Array(7)
//         .fill(null)
//         .map((_, i) => {
//           const date = new Date(monday.getTime() + i * 86400000); // सोमवार से रविवार तक की डेट्स निकालो
//           const todayDate = new Date();
//           return {
//             date,
//             status: date < todayDate ? "ABSENT" : "PENDING", // आज से पहले के दिन ABSENT होंगे
//           };
//         });
//       userSpin = new UserSpin({
//         user: userId,
//         spins,
//         startDate: monday,
//       });
//       await userSpin.save();
//     } else {
//       // **अगर यूज़र का स्पिन पहले से मौजूद है, तो अपडेट करो**
//       const todayDate = new Date();
//       userSpin.spins.forEach((spin) => {
//         console.log(spin.date);
//         if (spin.date < todayDate && spin.status === "PENDING") {
//           spin.status = "ABSENT"; // जो दिन गुजर चुके हैं, उन्हें ABSENT कर दो
//         }
//       });
//       await userSpin.save();
//     }
//     return userSpin?.spins;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };
const getMondayIST = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 330); // UTC से 5:30 घंटे जोड़ो (IST के लिए)
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1); // इस हफ्ते का सोमवार
    monday.setUTCHours(18, 30, 0, 0); // 00:00:00 IST
    return monday;
};
const assignDailySpin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user }) {
    try {
        const userId = user._id;
        const today = new Date();
        today.setMinutes(today.getMinutes() + 330); // IST में कन्वर्ट करो
        today.setUTCHours(18, 30, 0, 0); // 00:00:00 IST // समय हटाकर सिर्फ तारीख रखें
        // today.setHours(0, 0, 0, 0); // समय हटाकर सिर्फ तारीख रखें
        const monday = getMondayIST(); // IST के अनुसार सही सोमवार
        const existingSpin = yield UserSpin_modal_1.default.findOne({ user: userId });
        let userSpin = existingSpin;
        if (!existingSpin ||
            new Date(existingSpin.startDate).getTime() < monday.getTime()) {
            // **नया सप्ताह शुरू करें या पहली बार रिकॉर्ड बनाएं**
            const spins = Array(7)
                .fill(null)
                .map((_, i) => {
                const date = new Date(monday.getTime() + i * 86400000); // सोमवार से रविवार तक की डेट्स निकालो
                console.log(date);
                return {
                    date,
                    status: date < today ? "ABSENT" : "PENDING",
                };
            });
            userSpin = yield UserSpin_modal_1.default.findOneAndUpdate({ user: userId }, { $set: { spins, startDate: monday } }, { upsert: true, new: true });
        }
        else {
            // **अगर पहले से डेटा है, तो "ABSENT" अपडेट करो**
            userSpin = yield UserSpin_modal_1.default.findOneAndUpdate({
                user: userId,
                "spins.status": "PENDING",
                "spins.date": { $lt: today },
            }, { $set: { "spins.$.status": "ABSENT" } }, { new: true });
        }
        if (!userSpin) {
            userSpin = yield UserSpin_modal_1.default.findOne({ user: userId });
        }
        return userSpin === null || userSpin === void 0 ? void 0 : userSpin.spins;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
const claimSpin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setMinutes(today.getMinutes() + 330); // **IST में कन्वर्ट करें**
        today.setUTCHours(18, 30, 0, 0); // 00:00:00 IST // **सिर्फ तारीख रखें**
        const userSpin = yield UserSpin_modal_1.default.findOne({ user: userId });
        if (!userSpin) {
            return res
                .status(404)
                .json({ success: false, message: "Spin record not found" });
        }
        console.log("userSpin", userSpin);
        // ✅ **आज के स्पिन को खोजो (IST डेट से कंपेयर)**
        const todaySpin = userSpin.spins.find((spin) => new Date(spin.date).toLocaleDateString("en-GB") ===
            today.toLocaleDateString("en-GB"));
        console.log("todaySpin", todaySpin);
        if (!todaySpin) {
            return res
                .status(400)
                .json({ success: false, message: "No spin available for today" });
        }
        if (todaySpin.status !== "PENDING") {
            return res
                .status(400)
                .json({ success: false, message: "Spin already used or absent" });
        }
        // ✅ **आज कौन सा दिन है?**
        const spinIndex = userSpin.spins.findIndex((spin) => new Date(spin.date).toLocaleDateString("en-GB") ===
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
        const winningSpin = yield Spin_model_1.default.aggregate([
            { $match: spinQuery },
            { $sample: { size: 1 } }, // **रैंडम स्पिन चुनो**
        ]);
        if (!winningSpin.length) {
            return res
                .status(400)
                .json({ success: false, message: "No valid spin found" });
        }
        // ✅ **स्पिन जीतने का लॉजिक**
        const winningPrizeType = winningSpin[0].prizeType;
        let reward = null;
        switch (winningPrizeType) {
            case constants_1.PrizeName.ADD_CASH:
                reward = yield generateDepositCoupon({
                    value: winningSpin[0].value,
                    user: userId,
                });
                break;
            case constants_1.PrizeName.BUY_LOTTERY:
            case constants_1.PrizeName.FREE_LOTTERY:
                reward = yield generateLotteryCoupon({
                    value: winningSpin[0].value,
                    user: userId,
                });
                break;
            case constants_1.PrizeName.BONUS:
                reward = yield generateBonus({
                    value: winningSpin[0].value,
                    user: userId,
                });
                break;
            default:
                break;
        }
        // ✅ **आज का स्पिन अपडेट करें**
        if (winningPrizeType !== constants_1.PrizeName.TRY_AGAIN) {
            yield UserSpin_modal_1.default.findOneAndUpdate({ user: userId, "spins.date": today }, {
                $set: {
                    "spins.$.status": "COMPLETED",
                    "spins.$.reward": winningSpin[0]._id,
                },
            }, { new: true });
        }
        const userSpinData = yield assignDailySpin({ user: req.user });
        return res.status(200).json({
            success: true,
            message: "Spin claimed successfully!",
            data: winningSpin[0], // **यूज़र को उसका रिवॉर्ड भी दिखाएं**
            reward,
            userSpin: userSpinData,
        });
    }
    catch (error) {
        console.error("Error claiming spin:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.claimSpin = claimSpin;
const generateDepositCoupon = (_a) => __awaiter(void 0, [_a], void 0, function* ({ value, user, }) {
    try {
        const data = yield Coupon_model_1.default.create({
            name: "Spin Coupon",
            code: (0, helpers_1.generateCouponCode)("SP"),
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
            name: "Spin Coupon",
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
            order_id: (0, helpers_1.generateOrderId)("SP"), // generate a unique order ID
            from: user === null || user === void 0 ? void 0 : user.name,
            type: constants_1.BonusType.SPIN,
            details: `Spin Bonus`,
            date: new Date(),
            status: constants_1.Status.ACTIVE,
        });
        yield bonus.save();
        const transaction = new Transaction_model_1.default({
            user: user,
            order_id: bonus.order_id,
            amount: bonusAmount,
            type: constants_1.TransactionType.CREDIT,
            details: `Spin Bonus`,
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
