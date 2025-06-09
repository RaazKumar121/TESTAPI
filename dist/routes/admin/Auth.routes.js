"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../../middlewares/Auth");
const Auth_controller_1 = require("../../controllers/admin/Auth.controller");
// Create an instance of express.Router
const adminAuthRoutes = express_1.default.Router();
adminAuthRoutes.post("/register", Auth_1.ApiRateLimiter, Auth_controller_1.registerAdmin);
adminAuthRoutes.post("/check", Auth_1.ApiRateLimiter, Auth_controller_1.checkCredentials);
adminAuthRoutes.post("/login", Auth_1.ApiRateLimiter, Auth_controller_1.loginAdmin);
exports.default = adminAuthRoutes;
