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
exports.getUserDetails = exports.removeDeviceToken = exports.registerDeviceToken = exports.refreshToken = exports.applyRefercode = exports.signInWithGoogle = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errors_1 = require("../errors");
const google_auth_library_1 = require("google-auth-library");
const User_model_1 = __importDefault(require("../models/User.model"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const helpers_1 = require("../helpers");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
function generateReferralCode(email) {
    // Email ke first 3 characters ko le lo
    const prefix = email.slice(0, 3).toUpperCase();
    // Baaki 6 random uppercase alphanumeric characters generate karein
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 6; i++) {
        suffix += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Prefix aur suffix ko join kar ke referral code banayein
    const referralCode = prefix + suffix;
    return referralCode;
}
exports.signInWithGoogle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    if (!id_token) {
        throw new errors_1.BadRequestError("ID token is required");
    }
    try {
        const ticket = yield googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const verifiedEmail = payload === null || payload === void 0 ? void 0 : payload.email;
        if (!verifiedEmail) {
            throw new errors_1.UnauthenticatedError("Invalid or expired token");
        }
        let user = yield User_model_1.default.findOne({ email: verifiedEmail });
        if (user) {
            const accessToken = user.createAccessToken();
            const refreshToken = user.createRefreshToken();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                user: {
                    name: user.name,
                    id: user.id,
                    logo: user.logo,
                    email: user.email,
                    balance: user.balance,
                    refercode: user.refercode,
                    dailySpinsLeft: user.dailySpinsLeft,
                    totalCashOut: yield (0, helpers_1.getUserCashout)(user.id),
                },
                tokens: { access_token: accessToken, refresh_token: refreshToken },
                is_new: false,
            });
            return;
        }
        if (!payload.name || !payload.picture) {
            throw new errors_1.BadRequestError("Missing required fields for registration: name, picture");
        }
        user = new User_model_1.default({
            name: payload.name,
            email: verifiedEmail,
            refercode: generateReferralCode(verifiedEmail),
            logo: payload.picture,
            status: constants_1.UserStatus.ACTIVE,
        });
        yield user.save();
        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            user: {
                name: user.name,
                id: user.id,
                logo: user.logo,
                email: user.email,
                balance: user.balance,
                refercode: user.refercode,
                dailySpinsLeft: user.dailySpinsLeft,
                totalCashOut: yield (0, helpers_1.getUserCashout)(user.id),
            },
            tokens: { access_token: accessToken, refresh_token: refreshToken },
            is_new: true,
        });
    }
    catch (error) {
        console.error("Error in Google sign-in:", error);
        throw new errors_1.UnauthenticatedError("Google authentication failed");
    }
}));
exports.applyRefercode = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refercode } = req.body;
    const userId = req.user;
    if (!refercode) {
        throw new errors_1.BadRequestError("Refercode is required");
    }
    try {
        const referer = yield User_model_1.default.findOne({ refercode: refercode });
        if (!referer) {
            throw new errors_1.NotFoundError(" Invalid Refercode");
        }
        let user = yield User_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError(" Invalid token");
        }
        user.referer_code = refercode;
        user.refered_by = referer;
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            message: "Refercode accepted",
        });
        return;
    }
    catch (error) {
        console.error("Error in Apply refercode:", error);
        throw new errors_1.UnauthenticatedError("Refercode applying faild");
    }
}));
exports.refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        throw new errors_1.BadRequestError("Refresh token is required");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        let user = (yield User_model_1.default.findById(payload.id)) || (yield Admin_model_1.default.findById(payload.id));
        if (!user) {
            throw new errors_1.UnauthenticatedError("Invalid refresh token");
        }
        const newAccessToken = user.createAccessToken();
        const newRefreshToken = user.createRefreshToken();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        });
    }
    catch (error) {
        console.error("Error in refresh token:", error);
        throw new errors_1.UnauthenticatedError("Invalid or expired refresh token");
    }
}));
exports.registerDeviceToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { device_token } = req.body;
    if (!device_token) {
        throw new errors_1.BadRequestError("Device token is required");
    }
    try {
        const user = yield User_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        if (!user.device_tokens.includes(device_token)) {
            user.device_tokens.push(device_token);
            yield user.save();
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Device token registered successfully",
            device_tokens: user.device_tokens,
        });
    }
    catch (error) {
        console.error("Error registering device token:", error);
        throw new errors_1.BadRequestError("Failed to register device token");
    }
}));
exports.removeDeviceToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { device_token } = req.body;
    if (!device_token) {
        throw new errors_1.BadRequestError("Device token is required");
    }
    try {
        const user = yield User_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        user.device_tokens = user.device_tokens.filter((token) => token !== device_token);
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Device token removed successfully",
            device_tokens: user.device_tokens,
        });
    }
    catch (error) {
        console.error("Error removing device token:", error);
        throw new errors_1.BadRequestError("Failed to remove device token");
    }
}));
exports.getUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    if (!userId) {
        throw new errors_1.BadRequestError("userId is required");
    }
    try {
        const user = yield User_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.UnauthenticatedError("Invalid or expired token");
        }
        if (user) {
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
                is_new: false,
            });
            return;
        }
        throw new errors_1.NotFoundError("user not found");
    }
    catch (error) {
        console.error("Error in Google sign-in:", error);
        throw new errors_1.UnauthenticatedError("Google authentication failed");
    }
}));
