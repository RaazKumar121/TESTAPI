"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GoogleAuth_controller_1 = require("../controllers/GoogleAuth.controller");
const Auth_1 = require("../middlewares/Auth");
const User_controller_1 = require("../controllers/User.controller");
// Create an instance of express.Router
const authRoutes = express_1.default.Router();
authRoutes.get("/refercode/check/:code", User_controller_1.checkRefercode);
authRoutes.post("/send-otp", User_controller_1.sendOtp);
authRoutes.post("/signup", User_controller_1.userSignup);
authRoutes.post("/login", User_controller_1.userLogin);
authRoutes.post("/password/otp/send", User_controller_1.forgotPasswordOtp);
authRoutes.post("/password/otp/verify", User_controller_1.verifyOtp);
authRoutes.post("/password/reset", User_controller_1.verifyTokenAndResetPass);
// authRoutes.post("/signin-google", signInWithGoogle);
authRoutes.post("/refresh-token", GoogleAuth_controller_1.refreshToken);
authRoutes.post("/device-token/register", Auth_1.authMiddleware, GoogleAuth_controller_1.registerDeviceToken);
authRoutes.post("/device-token/remove", Auth_1.authMiddleware, GoogleAuth_controller_1.removeDeviceToken);
authRoutes.post("/apply-refercode", Auth_1.authMiddleware, GoogleAuth_controller_1.applyRefercode);
authRoutes.get("/user-details", Auth_1.authMiddleware, GoogleAuth_controller_1.getUserDetails);
exports.default = authRoutes;
