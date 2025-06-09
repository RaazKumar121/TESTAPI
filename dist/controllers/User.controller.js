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
exports.removeCoupon = exports.applyCoupon = exports.updateUserProfile = exports.updateUserLogo = exports.getLeaderboard = exports.createDepositRequest = exports.createWithdrawRequest = exports.getUserReferList = exports.getUserDetails = exports.deleteUser = exports.updateUserStatus = exports.updateUserBalance = exports.updateUser = exports.getUserById = exports.createUser = exports.getAllUser = exports.userLogin = exports.userSignup = exports.verifyTokenAndResetPass = exports.verifyOtp = exports.forgotPasswordOtp = exports.sendOtp = exports.checkRefercode = void 0;
const index_1 = require("./../constants/index");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = __importDefault(require("../models/User.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
const constants_1 = require("../constants");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const mongoose_1 = __importDefault(require("mongoose"));
const Withdraw_model_1 = __importDefault(require("../models/Withdraw.model"));
const Bonus_model_1 = __importDefault(require("../models/Bonus.model"));
const helpers_1 = require("../helpers");
const express_async_handler_2 = __importDefault(require("express-async-handler"));
const Otp_model_1 = __importDefault(require("../models/Otp.model"));
const Token_model_1 = __importDefault(require("../models/Token.model"));
const Coupon_model_1 = __importDefault(require("../models/Coupon.model"));
const ApplyedCoupon_model_1 = __importDefault(require("../models/ApplyedCoupon.model"));
const Deposit_model_1 = __importDefault(require("../models/Deposit.model"));
const Lottery_model_1 = __importDefault(require("../models/Lottery.model"));
const Offer_model_1 = __importDefault(require("../models/Offer.model"));
function generateReferralCode(email) {
    // Email ke first 3 characters ko le lo
    const prefix = email.slice(0, 3).toUpperCase();
    // Baaki 6 random uppercase alphanumeric characters generate karein
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 6; i++) {
        suffix += characters.charAt(Math.floor(Math.random() * 1000 * characters.length));
    }
    // Prefix aur suffix ko join kar ke referral code banayein
    const referralCode = prefix + suffix;
    return referralCode;
}
exports.checkRefercode = (0, express_async_handler_2.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.params;
    if (!code) {
        throw new errors_1.BadRequestError("code is required");
    }
    try {
        let user = yield User_model_1.default.findOne({ refercode: code });
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                valid: false,
            });
            return;
        }
        if (user) {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                valid: true,
            });
            return;
        }
    }
    catch (error) {
        console.error("Error in Google sign-in:", error);
        throw new errors_1.UnauthenticatedError("Server error");
    }
}));
exports.sendOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        let user = yield User_model_1.default.findOne({ email });
        let otp = yield Otp_model_1.default.findOne({ email });
        if (otp) {
            throw new errors_1.BadRequestError("Otp already sent");
        }
        if (!user) {
            otp = new Otp_model_1.default({
                email,
                otp: yield (0, helpers_1.generateOtp)(5),
            });
            yield otp.save();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                success: true,
                message: "Otp sent successfully",
                otp: otp.otp,
            });
            return;
        }
        else {
            throw new errors_1.BadRequestError("User already exists");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        return;
    }
}));
exports.forgotPasswordOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        let user = yield User_model_1.default.findOne({ email });
        let otp = yield Otp_model_1.default.findOne({ email });
        if (!user) {
            throw new errors_1.BadRequestError("User not found");
        }
        if (otp) {
            throw new errors_1.BadRequestError("Otp already sent");
        }
        otp = new Otp_model_1.default({
            email,
            otp: yield (0, helpers_1.generateOtp)(5),
        });
        yield otp.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Otp sent successfully",
            otp: otp.otp,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        return;
    }
}));
exports.verifyOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        let otpExist = yield Otp_model_1.default.findOne({ email, otp });
        if (!otpExist) {
            throw new errors_1.BadRequestError("wrong otp");
        }
        let token = new Token_model_1.default({
            email,
            token: yield (0, helpers_1.generatePasswordToken)(),
            type: "forget-password",
            otp: yield (0, helpers_1.generateOtp)(5),
        });
        yield token.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Otp verified successfully",
            token: token.token,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        return;
    }
}));
exports.verifyTokenAndResetPass = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        let isValid = yield Token_model_1.default.findOne({ token: token });
        if (!isValid) {
            throw new errors_1.BadRequestError("session expired");
        }
        let user = yield User_model_1.default.findOneAndUpdate({ email: isValid.email }, { password: yield (0, helpers_1.hashPassword)(password) });
        if (!user) {
            throw new errors_1.BadRequestError("User not found");
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Password reset successfully",
            // token: token.token,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
        return;
    }
}));
exports.userSignup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, referCode, otp, password } = req.body;
    try {
        const isValid = yield Otp_model_1.default.findOne({ email, otp });
        if (!isValid) {
            throw new errors_1.BadRequestError("Invalid otp");
        }
        let user = yield User_model_1.default.findOne({ email });
        if (!user) {
            let referer;
            if (referCode) {
                referer = yield User_model_1.default.findOne({ refercode: referCode });
            }
            const setting = yield Setting_model_1.default.findOne({}, { refer_bonus: 1, signup_bonus: 1 });
            user = new User_model_1.default({
                email,
                name,
                password: password,
                refercode: generateReferralCode(email),
                refered_by: referer,
                status: index_1.UserStatus.ACTIVE,
            });
            if (setting && setting.signup_bonus > 0) {
                user.bonus = setting.signup_bonus;
                const bonus = new Bonus_model_1.default({
                    user: user._id,
                    amount: setting.signup_bonus,
                    order_id: (0, helpers_1.generateOrderId)("REG"), // generate a unique order ID
                    from: "Signup Bonus",
                    type: index_1.BonusType.SIGNUP,
                    details: `Signup Bonus`,
                    date: new Date(),
                    status: 1,
                });
                yield bonus.save();
                const transaction = new Transaction_model_1.default({
                    user: user._id,
                    order_id: bonus.order_id,
                    amount: setting.signup_bonus,
                    type: constants_1.TransactionType.CREDIT,
                    details: `Signup Bonus`,
                    status: constants_1.TransactionStatus.APPROVED,
                });
                yield transaction.save();
            }
            yield user.save();
            if (referer && referer.status == index_1.UserStatus.ACTIVE) {
                if (setting && setting.refer_bonus > 0) {
                    referer.bonus += setting.refer_bonus;
                    yield referer.save();
                    const bonus = new Bonus_model_1.default({
                        user: referer._id,
                        amount: setting.refer_bonus,
                        order_id: (0, helpers_1.generateOrderId)("REF"), // generate a unique order ID
                        from: user.name,
                        type: index_1.BonusType.REFER,
                        details: `Referal Bonus`,
                        date: new Date(),
                        status: 1,
                    });
                    yield bonus.save();
                    const transaction = new Transaction_model_1.default({
                        user: referer._id,
                        order_id: bonus.order_id,
                        amount: setting.refer_bonus,
                        type: constants_1.TransactionType.CREDIT,
                        details: `Referal Bonus`,
                        status: constants_1.TransactionStatus.APPROVED,
                    });
                    yield transaction.save();
                }
            }
            const accessToken = user.createAccessToken();
            const refreshToken = user.createRefreshToken();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                user: {
                    name: user.name,
                    id: user.id,
                    logo: user.logo,
                    email: user.email,
                    balance: user.balance,
                    deposit: user.deposit,
                    bonus: user.bonus,
                    spinClaimDate: user.spinClaimDate,
                    refercode: user.refercode,
                },
                tokens: { access_token: accessToken, refresh_token: refreshToken },
            });
            return;
        }
        else {
            res.status(401).json({ success: false, message: "Email already exist" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
}));
exports.userLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let user = yield User_model_1.default.findOne({ email });
        if (user && (yield user.isPasswordMatched(password))) {
            const accessToken = user.createAccessToken();
            const refreshToken = user.createRefreshToken();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                user: {
                    name: user.name,
                    id: user.id,
                    logo: user.logo,
                    email: user.email,
                    mobile: user.mobile,
                    dob: user.dob,
                    gender: user.gender,
                    address: user.address,
                    balance: user.balance,
                    deposit: user.deposit,
                    bonus: user.bonus,
                    spinClaimDate: user.spinClaimDate,
                    refercode: user.refercode,
                },
                tokens: { access_token: accessToken, refresh_token: refreshToken },
            });
            return;
        }
        else {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
}));
// Get all data
exports.getAllUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User_model_1.default.find();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Create a new data
exports.createUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User_model_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: data,
            message: "User created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get data by ID
exports.getUserById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield User_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "User retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield User_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: data,
            message: "User updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateUserBalance = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { balance } = req.body;
        if (!balance) {
            throw new errors_1.BadRequestError("balance must be provided");
        }
        const data = yield User_model_1.default.findByIdAndUpdate(req.params.id, { balance }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "User updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateUserStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("status must be provided");
        }
        const data = yield User_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "User updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete data by ID
exports.deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield User_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get data details
exports.getUserDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User_model_1.default.findById(req.user, { refered_by: 0 });
        res.status(200).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Get data details
// export const getUserReferList = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await User.find(
//         { refered_by: req.user },
//         { name: 1, logo: 1, balance: 1 }
//       );
//       // console.log(data);
//       res.status(StatusCodes.OK).json({
//         success: true,
//         data: data,
//         message: "Data retrieved successfully",
//       });
//       return;
//     } catch (err: any) {
//       next(err); // Pass the error to the global error handler, if you have one
//     }
//   }
// );
const getUserReferList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.user._id; // जिस यूज़र का लीडरबोर्ड चाहिए
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // ✅ **1. इस हफ्ते और कुल रेफरल्स गिनना (केवल Active Users)**
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const [totalReferrals, thisWeekReferrals, referList] = yield Promise.all([
            User_model_1.default.countDocuments({ refered_by: userId, status: 1 }),
            User_model_1.default.countDocuments({
                refered_by: userId,
                status: 1,
                createdAt: { $gte: weekAgo },
            }),
            User_model_1.default.find({ refered_by: userId, status: 1 })
                .select("name logo _id")
                .lean(),
        ]);
        // ✅ **2. सभी यूज़र्स के deposits और bonuses एक साथ fetch करना**
        const userIds = referList.map((user) => user._id);
        const [depositData, bonusData] = yield Promise.all([
            Deposit_model_1.default.aggregate([
                { $match: { user: { $in: userIds }, status: 1 } },
                { $group: { _id: "$user", totalDeposit: { $sum: "$amount" } } },
            ]),
            Bonus_model_1.default.aggregate([
                { $match: { user: { $in: userIds }, status: 1 } },
                { $group: { _id: "$user", totalBonus: { $sum: "$amount" } } },
            ]),
        ]);
        // ✅ **3. जल्दी से deposit और bonus को map करना**
        const depositMap = new Map(depositData.map((d) => [d._id.toString(), d.totalDeposit]));
        const bonusMap = new Map(bonusData.map((b) => [b._id.toString(), b.totalBonus]));
        let totalDeposit = 0;
        referList.forEach((user) => {
            user.depositAmount = depositMap.get(user._id.toString()) || 0;
            user.commission = bonusMap.get(user._id.toString()) || 0;
            totalDeposit += user.depositAmount;
        });
        // ✅ **4. यूज़र का खुद का total commission निकालना**
        const totalCommission = yield Bonus_model_1.default.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(userId), status: 1 } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return res.status(200).json({
            thisWeekReferrals,
            totalReferrals,
            totalCommission: ((_a = totalCommission[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            totalDeposit,
            referList,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserReferList = getUserReferList;
// Get data Spin
// export const addUserSpin = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const today = new Date().toDateString();
//       console.log(today);
//       const user = await User.findById(req.user);
//       if (!user) {
//         res.status(400).json({ success: false, message: "user not found" });
//         return;
//       }
//       if (user!.dailySpinsLeft <= 0) {
//         res
//           .status(400)
//           .json({ success: false, message: "No spins left for today" });
//         return;
//       }
//       const setting = await Setting.findOne();
//       const spinResult = await SpinResult.findOne({
//         user: req.user,
//         date: today,
//       });
//       if (!spinResult || spinResult.results.length === 0) {
//         const totalSpins = setting!.daily_spin; // User gets 5 spins daily
//         const totalWins = setting!.daily_win; // Admin sets how many wins should happen
//         const totalLosses = totalSpins - totalWins;
//         const results: number[] = [];
//         for (let i = 0; i < totalWins; i++) {
//           const winAmount = Math.floor(Math.random() * 1000 * (500 - 100 + 1)) + 100;
//           results.push(winAmount);
//         }
//         for (let i = 0; i < totalLosses; i++) {
//           results.push(0);
//         }
//         results.sort(() => Math.random() * 1000 - 0.5);
//         const spinResult = new SpinResult({
//           user: req.user,
//           date: today,
//           results,
//         });
//         const spinPoint = spinResult.results.shift();
//         await spinResult.save();
//         Transaction.create({
//           user: req.user,
//           order_id: today,
//           amount: spinPoint,
//           type: TransactionType.CREDIT,
//           details: `spin and win ₹${spinPoint}`,
//           status: TransactionStatus.APPROVED,
//         });
//         user!.dailySpinsLeft -= 1;
//         user!.balance += spinPoint;
//         await user!.save();
//         res.status(200).json({
//           success: true,
//           data: spinPoint,
//           message: "Spin successful",
//         });
//         return;
//       } else {
//         const spinPoint = spinResult.results.shift(); // Get the first result
//         await spinResult.save();
//         Transaction.create({
//           user: req.user,
//           order_id: today,
//           amount: spinPoint,
//           type: TransactionType.CREDIT,
//           details: `spin and win ₹${spinPoint}`,
//           status: TransactionStatus.APPROVED,
//         });
//         user!.dailySpinsLeft -= 1;
//         user!.balance += spinPoint;
//         await user!.save();
//         res.status(200).json({
//           success: true,
//           data: spinPoint,
//           message: "Spin successful",
//         });
//         return;
//       }
//     } catch (err: any) {
//       next(err); // Pass the error to the global error handler, if you have one
//     }
//   }
// );
// Withdraw API
const createWithdrawRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { amount, type, payment_details } = req.body;
        const userId = req.user;
        console.log(req.body);
        if (!amount || !type || !payment_details) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Please fill all details" });
        }
        // Fetch the user and check balance
        const user = yield User_model_1.default.findById(userId).session(session);
        if (!user) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "User not found" });
        }
        if (user.balance < amount) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Insufficient balance" });
        }
        const setting = yield Setting_model_1.default.findOne();
        let miniwithdraw = 0;
        switch (type) {
            case constants_1.WithdrawType.BANK:
                miniwithdraw = setting === null || setting === void 0 ? void 0 : setting.min_withdraw;
                break;
            case constants_1.WithdrawType.UPI:
                miniwithdraw = setting === null || setting === void 0 ? void 0 : setting.min_withdraw;
                break;
            case constants_1.WithdrawType.GIFTCARD:
                miniwithdraw = setting === null || setting === void 0 ? void 0 : setting.min_withdraw;
                break;
            default:
                break;
        }
        if (amount < miniwithdraw) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: `minimum withdraw ${miniwithdraw}`,
            });
        }
        // Check if there's already a pending withdrawal for this user
        const existingRequest = yield Withdraw_model_1.default.findOne({
            user: user,
            status: constants_1.WithdrawStatus.PENDING,
        }).session(session);
        if (existingRequest) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "A withdrawal request is already pending. Please wait.",
            });
        }
        // Deduct the amount from user's balance
        user.balance -= amount;
        yield user.save({ session });
        // Create a new withdrawal request
        const newWithdraw = new Withdraw_model_1.default({
            user: userId,
            order_id: (0, helpers_1.generateOrderId)("WD"), // generate a unique order ID
            amount,
            payment_details,
            bank: payment_details,
            type,
            details: `Withdrawal of ${amount} by ${type}`,
            status: constants_1.WithdrawStatus.PENDING,
        });
        yield newWithdraw.save({ session });
        // Create a transaction record for this withdrawal
        const newTransaction = new Transaction_model_1.default({
            user: user,
            order_id: newWithdraw.order_id,
            amount,
            type: constants_1.TransactionType.DEBIT,
            details: `Withdrawal of ${amount} by ${type}`,
            status: constants_1.TransactionStatus.PENDING,
        });
        yield newTransaction.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Withdrawal request and transaction created successfully",
            data: newWithdraw,
            // transaction: newTransaction,
        });
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        // next(error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Validation error",
                details: error.errors,
            });
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message || "Unknown error",
        });
    }
});
exports.createWithdrawRequest = createWithdrawRequest;
function runWithRetry(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield mongoose_1.default.startSession();
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                session.startTransaction();
                yield fn(session);
                yield session.commitTransaction();
                return;
            }
            catch (error) {
                if (error.hasErrorLabel("TransientTransactionError")) {
                    console.log("Transient error, retrying...");
                    continue;
                }
                throw error;
            }
            finally {
                session.endSession();
            }
        }
    });
}
const createDepositRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { amount, type, payment_details, offer } = req.body;
        const userId = req.user;
        if (!amount || !type || !payment_details) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Please fill all details" });
        }
        let totalAmount = amount;
        let promoBonus = 0;
        let is_coupon = false;
        let is_offer = false;
        let offerId = null;
        let couponId = null;
        // Fetch the user and check balance
        const user = yield User_model_1.default.findById(userId);
        if (!user || user.status !== index_1.Status.ACTIVE) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "User not found" });
        }
        const existingRequest = yield Deposit_model_1.default.findOne({
            user: user,
        }).session(session);
        const setting = yield Setting_model_1.default.findOne({}, { min_deposit: 1, refer_first_deposit: 1, refer_commision: 1 });
        if ((existingRequest === null || existingRequest === void 0 ? void 0 : existingRequest.payment_details) == payment_details) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "A Deposit request is already exist.",
            });
        }
        // Deduct the amount from user's balance
        // user.balance -= amount;
        // await user.save({ session });
        if (setting.min_deposit > amount) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: `minimum deposit ${setting.min_deposit}`,
            });
        }
        if (offer) {
            const applied = yield ApplyedCoupon_model_1.default.findOne({
                user: userId,
                _id: offer,
                status: index_1.Status.INACTIVE,
            }).session(session);
            if (!applied) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: "Invalid promo code" });
            }
            if (applied.type == index_1.CouponType.LOTTERY) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: "Invalid promo code" });
            }
            if (applied.mode == "coupon") {
                const promoCode = yield Coupon_model_1.default.findOne({
                    _id: applied.coupon,
                    status: index_1.Status.ACTIVE,
                }).session(session);
                if (!promoCode || promoCode.type == index_1.CouponType.LOTTERY) {
                    console.log("Invalid promo code3");
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "Invalid promo code" });
                }
                applied.status = 1;
                is_coupon = true;
                couponId = promoCode.id;
                promoBonus += totalAmount * (promoCode.value / 100);
            }
            else if (applied.mode == "offer") {
                const offer = yield Offer_model_1.default.findOne({
                    _id: applied.offer,
                    status: index_1.Status.ACTIVE,
                }).session(session);
                if (!offer || offer.mode == index_1.CouponType.LOTTERY) {
                    console.log("Invalid offer");
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "Invalid offer" });
                }
                if (offer.type == index_1.OfferType.AMOUNT && offer.min_value > totalAmount) {
                    console.log("Invalid offer1");
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid offer",
                    });
                }
                applied.status = 1;
                is_offer = true;
                offerId = offer.id;
                promoBonus += totalAmount * (offer.value / 100);
            }
            yield applied.save({ session });
        }
        // Create a new withdrawal request
        const newDeposit = new Deposit_model_1.default({
            user: userId,
            order_id: (0, helpers_1.generateOrderId)("DP"), // generate a unique order ID
            amount,
            payment_details,
            type,
            details: `Deposit of ${amount} by ${type}`,
            is_coupon,
            is_offer,
            offer: offerId,
            coupon: couponId,
            bonus: promoBonus,
            status: constants_1.TransactionStatus.PENDING,
        });
        yield newDeposit.save({ session });
        // Create a transaction record for this withdrawal
        const newTransaction = new Transaction_model_1.default({
            user: user,
            order_id: newDeposit.order_id,
            amount,
            type: constants_1.TransactionType.CREDIT,
            details: `Deposit of ${amount} by ${type}`,
            status: constants_1.TransactionStatus.PENDING,
        });
        yield newTransaction.save({ session });
        if (setting && (user === null || user === void 0 ? void 0 : user.refered_by)) {
            const referer = yield User_model_1.default.findById(user.refered_by).session(session);
            if (referer && referer.status === index_1.Status.ACTIVE) {
                if (!existingRequest) {
                    if (setting.refer_first_deposit > 0) {
                        const reward = (amount * setting.refer_first_deposit) / 100;
                        // referer.bonus += (amount * setting.refer_first_deposit) / 100;
                        const bonus = new Bonus_model_1.default({
                            user: referer._id,
                            amount: reward,
                            order_id: newDeposit.order_id.replace(/^DP-/, "REF-"), // generate a unique order ID
                            from: user === null || user === void 0 ? void 0 : user.name,
                            type: index_1.BonusType.REFER,
                            details: `Refer Bonus`,
                            date: new Date(),
                            status: newTransaction.status,
                        });
                        yield bonus.save({ session });
                        const transaction = new Transaction_model_1.default({
                            user: referer._id,
                            order_id: bonus.order_id,
                            amount: reward,
                            type: constants_1.TransactionType.CREDIT,
                            details: `Refer Bonus`,
                            status: constants_1.TransactionStatus.PENDING,
                        });
                        yield transaction.save({ session });
                    }
                }
                else {
                    const reward = (amount * setting.refer_commision) / 100;
                    // referer.bonus += (amount * setting.refer_first_deposit) / 100;
                    const bonus = new Bonus_model_1.default({
                        user: referer._id,
                        amount: reward,
                        order_id: newDeposit.order_id.replace(/^DP-/, "REF-"), // generate a unique order ID
                        from: user === null || user === void 0 ? void 0 : user.name,
                        type: index_1.BonusType.REFER,
                        details: `Refer Bonus`,
                        date: new Date(),
                        status: newTransaction.status,
                    });
                    yield bonus.save({ session });
                    const transaction = new Transaction_model_1.default({
                        user: referer._id,
                        order_id: bonus.order_id,
                        amount: reward,
                        type: constants_1.TransactionType.CREDIT,
                        details: `Refer Bonus`,
                        status: constants_1.TransactionStatus.PENDING,
                    });
                    yield transaction.save({ session });
                }
                yield referer.save({ session });
            }
        }
        // const isValid = await referBonusDeposit({
        //   amount: amount,
        //   referer: user?.refered_by,
        //   user: user,
        // });
        yield session.commitTransaction();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Deposit request and transaction created successfully",
            data: newDeposit,
            // transaction: newTransaction,
        });
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        // next(error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Validation error",
                details: error.errors,
            });
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message || "Unknown error",
        });
    }
    finally {
        session.endSession();
    }
});
exports.createDepositRequest = createDepositRequest;
exports.getLeaderboard = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all users, sort by balance in descending order, and select relevant fields
        const leaderboard = yield User_model_1.default.find({})
            .sort({ balance: -1 }) // Sort by balance in descending order
            .select("name balance logo") // Select only name and balance fields (adjust as needed)
            .lean(); // Convert mongoose documents to plain objects
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: leaderboard,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Server error" });
    }
}));
// export const claimTodayBonus = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { user } = req;
//     try {
//       const bonus = await Setting.findOne();
//       const trans = await Bonus.create({ user, amount: bonus?.daily_bonus });
//       res.status(StatusCodes.OK).json({
//         success: true,
//         data: trans,
//         message: "Data retrieved successfully",
//       });
//       return;
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: "Server error" });
//     }
//   }
// );
// export const claimBonus = async (req: Request, res: Response) => {
//   const session = await mongoose.startSession(); // Start a transaction session
//   session.startTransaction();
//   try {
//     const bonus = await Setting.findOne();
//     const userId = req.user._id; // Assumes req.user is populated from auth middleware
//     const bonusAmount = bonus?.daily_bonus; // Specify the bonus amount or make it dynamic
//     // Define start and end of current day
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);
//     // Check if user has already claimed bonus today
//     const existingBonus = await Bonus.findOne({
//       user: userId,
//       date: { $gte: startOfDay, $lte: endOfDay },
//     });
//     if (existingBonus) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Bonus already claimed for today",
//       });
//     }
//     // Create new bonus entry
//     const newBonus = await new Bonus({
//       user: userId,
//       amount: bonusAmount,
//       date: new Date(),
//     }).save({ session });
//     // Update user balance
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $inc: { balance: bonusAmount } }, // Increment user's balance by bonusAmount
//       { new: true, session }
//     );
//     // Create a transaction record
//     const newTransaction = new Transaction({
//       user: userId,
//       order_id: `BONUS_${newBonus._id}`, // Generate a unique order ID
//       amount: bonusAmount,
//       type: TransactionType.CREDIT,
//       details: "Daily Bonus Claim",
//       status: TransactionStatus.APPROVED,
//     });
//     await newTransaction.save({ session });
//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();
//     return res.status(StatusCodes.CREATED).json({
//       success: true,
//       message: "Bonus claimed successfully",
//       // data: { bonus: newBonus, user, transaction: newTransaction },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "An error occurred while claiming the bonus",
//     });
//   }
// };
exports.updateUserLogo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        const { logo } = req.body;
        if (!logo) {
            throw new errors_1.BadRequestError("logo must be provided");
        }
        const data = yield User_model_1.default.findByIdAndUpdate(user, { logo }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            user: {
                name: user.name,
                id: user.id,
                logo: user.logo,
                email: user.email,
                mobile: user.mobile,
                dob: user.dob,
                gender: user.gender,
                address: user.address,
                balance: user.balance,
                deposit: user.deposit,
                bonus: user.bonus,
                spinClaimDate: user.spinClaimDate,
                refercode: user.refercode,
            },
            message: "User updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
exports.updateUserProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        const { logo, name, mobile, dob, gender, address } = req.body;
        if (!name || !mobile) {
            throw new errors_1.BadRequestError("all field must be provided");
        }
        const data = yield User_model_1.default.findByIdAndUpdate(user, { logo, name, mobile, dob, gender, address }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            user: {
                name: user.name,
                id: user.id,
                logo: user.logo,
                email: user.email,
                mobile: user.mobile,
                dob: user.dob,
                gender: user.gender,
                address: user.address,
                balance: user.balance,
                deposit: user.deposit,
                bonus: user.bonus,
                spinClaimDate: user.spinClaimDate,
                refercode: user.refercode,
            },
            message: "User updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// export const applyCoupon = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { amount, quantity, code, lotteryId, mode, type } = req.body;
//     if (!code || !mode || !type) {
//       throw new BadRequestError("all field is required");
//     }
//     try {
//       if (mode === "coupon") {
//         const coupon = await Coupon.findOne({
//           code: code,
//           status: Status.ACTIVE,
//         });
//         if (!coupon) {
//           res.status(200).json({
//             success: false,
//             message: "invalid coupon",
//           });
//           return;
//         }
//         await ApplyedCoupon.findOneAndDelete({
//           user: req.user,
//           coupon: coupon,
//           status: 0,
//         });
//         const limit = await ApplyedCoupon.find({
//           coupon: coupon,
//         }).countDocuments();
//         if (coupon?.user && coupon?.user != req.user) {
//           res.status(200).json({
//             success: false,
//             message: "invalid coupon",
//           });
//           return;
//         }
//         if (coupon?.limit <= limit) {
//           res.status(200).json({
//             success: false,
//             message: "coupon limit exceeded",
//           });
//           return;
//         }
//         if (type === CouponType.LOTTERY) {
//           if (!lotteryId) {
//             res.status(200).json({
//               success: false,
//               message: "lottery id is required",
//             });
//             return;
//           }
//           if (coupon.type !== CouponType.COMMON && coupon.type !== type) {
//             res.status(200).json({
//               success: false,
//               message: "invalid coupon",
//             });
//             return;
//           }
//           const lottery = await Lottery.findOne({
//             _id: lotteryId,
//             status: LotteryStatus.ACTIVE,
//           });
//           if (!lottery) {
//             res.status(200).json({
//               success: false,
//               message: "invalid lottery",
//             });
//             return;
//           }
//           if (
//             coupon.type === CouponType.LOTTERY &&
//             coupon?.lottery != lotteryId
//           ) {
//             res.status(200).json({
//               success: false,
//               message: "invalid lottery",
//             });
//             return;
//           }
//           if (coupon?.c_type === OfferType.AMOUNT) {
//             if (coupon?.min_value > lottery?.price * quantity) {
//               res.status(200).json({
//                 success: false,
//                 message: "invalid coupon",
//               });
//               return;
//             }
//             const data = await ApplyedCoupon.create({
//               user: req.user,
//               coupon: coupon,
//               type: CouponType.LOTTERY,
//               mode: "coupon",
//               status: 0,
//             });
//             res.status(200).json({
//               success: true,
//               data: data,
//               message: "Coupon retrieved successfully",
//             });
//           } else if (coupon?.c_type === OfferType.QUENTITY) {
//             if (coupon?.min_value > quantity) {
//               res.status(200).json({
//                 success: false,
//                 message: "invalid coupon",
//               });
//               return;
//             }
//           }
//           const data = await ApplyedCoupon.create({
//             user: req.user,
//             coupon: coupon,
//             type: CouponType.LOTTERY,
//             mode: "coupon",
//             status: 0,
//           });
//           res.status(200).json({
//             success: true,
//             data: data,
//             message: "Coupon retrieved successfully",
//           });
//         } else if (type === CouponType.DEPOSIT) {
//           if (coupon?.min_value > amount) {
//             res.status(200).json({
//               success: false,
//               message: "invalid coupon",
//             });
//             return;
//           }
//           const data = await ApplyedCoupon.create({
//             user: req.user,
//             coupon: coupon,
//             type: CouponType.DEPOSIT,
//             mode: "coupon",
//             status: 0,
//           });
//           res.status(200).json({
//             success: true,
//             data: data,
//             message: "Coupon retrieved successfully",
//           });
//         }
//       } else if (mode === "offer") {
//         const offer = await Offer.findOne({
//           code: code,
//           status: Status.ACTIVE,
//         });
//         if (!offer) {
//           res.status(200).json({
//             success: false,
//             message: "invalid offer",
//           });
//           return;
//         }
//         const limit = await ApplyedCoupon.find({
//           offer: offer,
//         }).countDocuments();
//         // Offer logic here
//         if (offer.mode !== type) {
//           res.status(200).json({
//             success: false,
//             message: "invalid offer",
//           });
//           return;
//         }
//         if (offer.limit <= limit) {
//           res.status(200).json({
//             success: false,
//             message: "offer limit exceeded",
//           });
//           return;
//         }
//         if (type === CouponType.LOTTERY) {
//           if (!lotteryId) {
//             res.status(200).json({
//               success: false,
//               message: "lottery id is required",
//             });
//             return;
//           }
//           const lottery = await Lottery.findOne({
//             _id: lotteryId,
//             status: LotteryStatus.ACTIVE,
//           });
//           if (!lottery || offer?.exclude_lottery == lotteryId) {
//             res.status(200).json({
//               success: false,
//               message: "invalid offer",
//             });
//             return;
//           }
//           if (offer?.type === OfferType.AMOUNT) {
//             if (offer?.min_value > lottery?.price * quantity) {
//               res.status(200).json({
//                 success: false,
//                 message: "invalid offer",
//               });
//               return;
//             }
//             const data = await ApplyedCoupon.create({
//               user: req.user,
//               offer: offer,
//               type: CouponType.LOTTERY,
//               mode: "offer",
//               status: 0,
//             });
//             res.status(200).json({
//               success: true,
//               data: data,
//               message: "Offer retrieved successfully",
//             });
//           } else if (offer?.type === OfferType.QUENTITY) {
//             if (offer?.min_value > quantity) {
//               res.status(200).json({
//                 success: false,
//                 message: "invalid offer",
//               });
//               return;
//             }
//             const data = await ApplyedCoupon.create({
//               user: req.user,
//               offer: offer,
//               type: CouponType.LOTTERY,
//               mode: "offer",
//               status: 0,
//             });
//             res.status(200).json({
//               success: true,
//               data: data,
//               message: "Offer retrieved successfully",
//             });
//           }
//         } else if (type === CouponType.DEPOSIT) {
//           if (offer?.min_value > amount) {
//             res.status(200).json({
//               success: false,
//               message: "invalid offer",
//             });
//             return;
//           }
//           const data = await ApplyedCoupon.create({
//             user: req.user,
//             offer: offer,
//             type: CouponType.DEPOSIT,
//             mode: "offer",
//             status: 0,
//           });
//           res.status(200).json({
//             success: true,
//             data: data,
//             message: "Coupon retrieved successfully",
//           });
//         }
//       }
//       // const data = await Coupon.findOne({ code: code, status: Status.ACTIVE });
//       // await ApplyedCoupon.findOneAndDelete({
//       //   user: req.user,
//       //   coupon: data,
//       //   status: 0,
//       // });
//       // const limit = await ApplyedCoupon.find({ coupon: data }).countDocuments();
//       // if (!data) {
//       //   res.status(200).json({
//       //     success: false,
//       //     message: "invalid coupon",
//       //   });
//       //   return;
//       // }
//       // if (data?.limit <= limit) {
//       //   res.status(200).json({
//       //     success: false,
//       //     message: "coupon limit exceeded",
//       //   });
//       //   return;
//       // }
//       // if (data?.user && data?.user != req.user) {
//       //   res.status(200).json({
//       //     success: false,
//       //     message: "invalid coupon",
//       //   });
//       //   return;
//       // }
//       // if (data?.type === CouponType.COMMON) {
//       //   await ApplyedCoupon.create({ user: req.user, coupon: data });
//       //   res.status(200).json({
//       //     success: true,
//       //     data: data,
//       //     message: "Coupon retrieved successfully",
//       //   });
//       //   return;
//       // } else if (
//       //   data?.type === CouponType.LOTTERY &&
//       //   data?.lottery == lotteryId
//       // ) {
//       //   await ApplyedCoupon.create({ user: req.user, coupon: data });
//       //   res.status(200).json({
//       //     success: true,
//       //     data: data,
//       //     message: "Coupon retrieved successfully",
//       //   });
//       //   return;
//       // } else if (data?.type === CouponType.DEPOSIT) {
//       //   await ApplyedCoupon.create({ user: req.user, coupon: data });
//       //   res.status(200).json({
//       //     success: true,
//       //     data: data,
//       //     message: "Coupon retrieved successfully",
//       //   });
//       //   return;
//       // } else {
//       //   res.status(200).json({
//       //     success: false,
//       //     message: "invalid coupon",
//       //   });
//       //   return;
//       // }
//     } catch (err: any) {
//       console.log(err);
//       next(err);
//     }
//   }
// );
exports.applyCoupon = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { amount, quantity, code, lotteryId, mode, type } = req.body;
        if (!code || !mode || !type) {
            res
                .status(400)
                .json({ success: false, message: "All fields are required" });
            return;
        }
        yield ApplyedCoupon_model_1.default.findOneAndDelete({
            user: req.user,
            status: 0,
        });
        if (mode === "coupon") {
            const coupon = yield Coupon_model_1.default.findOne({ code, status: index_1.Status.ACTIVE })
                .select("_id value limit min_value type c_type lottery user value")
                .lean();
            if (!coupon) {
                res.status(400).json({ success: false, message: "Invalid coupon" });
                return;
            }
            const limitUsed = yield ApplyedCoupon_model_1.default.countDocuments({
                coupon: coupon._id,
            });
            if (coupon.user && coupon.user.toString() !== req.user._id.toString()) {
                res.status(400).json({ success: false, message: "Invalid coupon" });
                return;
            }
            if (coupon.limit <= limitUsed) {
                res
                    .status(400)
                    .json({ success: false, message: "Coupon limit exceeded" });
                return;
            }
            if (type === index_1.CouponType.LOTTERY) {
                if (!lotteryId) {
                    res
                        .status(400)
                        .json({ success: false, message: "Lottery ID is required" });
                    return;
                }
                const lottery = yield Lottery_model_1.default.findOne({
                    _id: lotteryId,
                    status: index_1.LotteryStatus.ACTIVE,
                })
                    .select("_id price")
                    .lean();
                if (!lottery ||
                    (coupon.type === index_1.CouponType.LOTTERY &&
                        coupon.lottery.toString() !== lotteryId)) {
                    res
                        .status(400)
                        .json({ success: false, message: "Invalid lottery" });
                    return;
                }
                if (coupon.c_type === index_1.OfferType.AMOUNT &&
                    coupon.min_value > lottery.price * quantity) {
                    res.status(400).json({ success: false, message: "Invalid coupon" });
                    return;
                }
                const data = yield ApplyedCoupon_model_1.default.create({
                    user: req.user._id,
                    coupon: coupon._id,
                    type,
                    mode,
                    status: 0,
                });
                res.status(200).json({
                    success: true,
                    data: {
                        id: data._id,
                        type: data.type,
                        mode: data.mode,
                        value: coupon.value,
                        code: coupon.code,
                    },
                    message: "Coupon applied successfully",
                });
                return;
            }
            if (type === index_1.CouponType.DEPOSIT && coupon.min_value > amount) {
                res.status(400).json({
                    success: false,
                    message: `minimum deposit amount is ${coupon.min_value} `,
                });
                return;
            }
            const data = yield ApplyedCoupon_model_1.default.create({
                user: req.user._id,
                coupon: coupon._id,
                type,
                mode,
                status: 0,
            });
            res.status(200).json({
                success: true,
                data: {
                    id: data._id,
                    type: data.type,
                    mode: data.mode,
                    value: coupon.value,
                    code: coupon.code,
                },
                message: "Coupon applied successfully",
            });
            return;
        }
        if (mode === "offer") {
            const offer = yield Offer_model_1.default.findOne({ code, status: index_1.Status.ACTIVE })
                .select("_id type min_value limit mode exclude_lottery value")
                .lean();
            if (!offer || offer.mode !== type) {
                res.status(400).json({ success: false, message: "Invalid offer" });
                return;
            }
            const limitUsed = yield ApplyedCoupon_model_1.default.countDocuments({
                offer: offer._id,
            });
            console.log(offer.limit, limitUsed);
            if (offer.limit <= limitUsed) {
                res
                    .status(400)
                    .json({ success: false, message: "Offer limit exceeded" });
                return;
            }
            if (type === index_1.CouponType.LOTTERY) {
                if (!lotteryId) {
                    res
                        .status(400)
                        .json({ success: false, message: "Lottery ID is required" });
                    return;
                }
                const lottery = yield Lottery_model_1.default.findOne({
                    _id: lotteryId,
                    status: index_1.LotteryStatus.ACTIVE,
                })
                    .select("_id price")
                    .lean();
                if (!lottery || ((_a = offer.exclude_lottery) === null || _a === void 0 ? void 0 : _a.toString()) === lotteryId) {
                    res.status(400).json({ success: false, message: "Invalid offer" });
                    return;
                }
                if (offer.type === index_1.OfferType.AMOUNT &&
                    offer.min_value > lottery.price * quantity) {
                    res.status(400).json({ success: false, message: "Invalid offer" });
                    return;
                }
            }
            if (type === index_1.CouponType.DEPOSIT && offer.min_value > amount) {
                res.status(400).json({
                    success: false,
                    message: `minimum deposit amount is ${offer.min_value} `,
                });
                return;
            }
            const data = yield ApplyedCoupon_model_1.default.create({
                user: req.user._id,
                offer: offer._id,
                type,
                mode,
                status: 0,
            });
            res.status(200).json({
                success: true,
                data: {
                    id: data._id,
                    type: data.type,
                    mode: data.mode,
                    value: offer.value,
                },
                message: "Offer applied successfully",
            });
            return;
        }
        res.status(400).json({ success: false, message: "Invalid mode" });
        return;
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
exports.removeCoupon = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code) {
        throw new errors_1.BadRequestError("all field is required");
    }
    try {
        yield ApplyedCoupon_model_1.default.deleteOne({ user: req.user, code: code, status: 0 });
        res.status(200).json({
            success: true,
            message: "Coupon removed successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
