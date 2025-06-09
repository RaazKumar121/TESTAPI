"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ApiRateLimiter = exports.isAdmin = exports.authMiddleware = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
// Middleware to authenticate users
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Ensure returning `void` or `Promise<void>`
    let token;
    // Check for token in headers or cookies
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        token = req === null || req === void 0 ? void 0 : req.headers.authorization.split(" ")[1];
    }
    else if ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.token) {
        // Ensure cookies is defined before accessing token
        token = req.cookies.token;
    }
    if (!token) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Authorization token not available",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Check if the user exists and is active
        const user = (yield User_model_1.default.findById(decoded.id)) || (yield Admin_model_1.default.findById(decoded.id));
        if ((user === null || user === void 0 ? void 0 : user.status) !== constants_1.UserStatus.ACTIVE) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Account not activated or blocked",
            });
            return;
        }
        req.user = user;
        next(); // Proceed to the next middleware
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Token has expired",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Authorization failed",
        });
        return;
    }
});
exports.authMiddleware = authMiddleware;
// Middleware to verify admin access
exports.isAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // Ensure returning `void` or `Promise<void>`
    let token;
    try {
        if (((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) ||
            ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.token) // Ensure cookies is defined before accessing token
        ) {
            token =
                ((_e = (_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.authorization) === null || _e === void 0 ? void 0 : _e.split(" ")[1]) || ((_f = req.cookies) === null || _f === void 0 ? void 0 : _f.token);
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
                let user = yield Admin_model_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
                if (!user) {
                    user = yield User_model_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
                }
                if (user && user.status === 1) {
                    req.user = user;
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: "Your Account is not activated or blocked",
                    });
                    return;
                }
                next(); // Proceed to the next middleware
            }
            else {
                throw new errors_1.UnauthenticatedError("Token expired, please login again");
            }
        }
        else {
            throw new errors_1.UnauthenticatedError("Authorization token not available");
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: error.message || "Authentication invalid",
        });
        return;
    }
}));
// Rate Limiter
exports.ApiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Use `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
