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
exports.checkCredentials = exports.loginAdmin = exports.registerAdmin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Admin_model_1 = __importDefault(require("../../models/Admin.model"));
const errors_1 = require("../../errors");
const http_status_codes_1 = require("http-status-codes");
// Handler to register admin
const registerAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        let admin = yield Admin_model_1.default.findOne({ email });
        if (!admin) {
            admin = new Admin_model_1.default(req.body);
            yield admin.save();
            const accessToken = admin.createAccessToken();
            const refreshToken = admin.createRefreshToken();
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.status(201).json({
                message: "Register Success",
                status: 1,
                user: {
                    name: admin === null || admin === void 0 ? void 0 : admin.name,
                    email: admin === null || admin === void 0 ? void 0 : admin.email,
                    logo: admin === null || admin === void 0 ? void 0 : admin.logo,
                    status: admin === null || admin === void 0 ? void 0 : admin.status,
                    id: admin === null || admin === void 0 ? void 0 : admin.id,
                    tokens: { access_token: accessToken, refresh_token: refreshToken },
                },
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
exports.registerAdmin = registerAdmin;
// Handler to login admin
const checkCredentials = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.BadRequestError(" email or password is required");
    }
    try {
        let admin = yield Admin_model_1.default.findOne({ email });
        // console.log(admin);
        if (admin && (yield admin.isPasswordMatched(password))) {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Login Success",
                status: http_status_codes_1.StatusCodes.OK,
            });
            return;
        }
        else {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.checkCredentials = checkCredentials;
const loginAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.BadRequestError(" email or password is required");
    }
    try {
        let admin = yield Admin_model_1.default.findOne({ email });
        if (admin && (yield admin.isPasswordMatched(password))) {
            const accessToken = admin.createAccessToken();
            const refreshToken = admin.createRefreshToken();
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Login Success",
                status: 1,
                user: {
                    name: admin === null || admin === void 0 ? void 0 : admin.name,
                    email: admin === null || admin === void 0 ? void 0 : admin.email,
                    logo: admin === null || admin === void 0 ? void 0 : admin.logo,
                    status: admin === null || admin === void 0 ? void 0 : admin.status,
                    id: admin === null || admin === void 0 ? void 0 : admin.id,
                    tokens: { access_token: accessToken, refresh_token: refreshToken },
                },
            });
            return;
        }
        else {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.loginAdmin = loginAdmin;
