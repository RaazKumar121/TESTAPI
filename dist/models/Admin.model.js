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
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = require("../constants");
// Define the Admin model
const AdminSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [128, "Password must be less than 128 characters long"],
        validate: {
            validator: function (value) {
                // Require at least one uppercase letter, one lowercase letter, one special character and one number
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
                return regex.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        },
    },
    logo: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        default: constants_1.UserStatus.INACTIVE,
        enum: [constants_1.UserStatus.ACTIVE, constants_1.UserStatus.INACTIVE, constants_1.UserStatus.BLOCKED],
    },
    loginCount: {
        type: Number,
        default: 0,
    },
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        },
    },
    timestamps: true,
});
// Hash password before saving to database
AdminSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password") || this.isNew) {
            try {
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hash = yield bcryptjs_1.default.hash(this.password, salt);
                this.password = hash;
                next();
            }
            catch (err) {
                return next(err);
            }
        }
        else {
            return next();
        }
    });
});
// Compare password with hashed password in database
AdminSchema.methods.isPasswordMatched = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
// Increment login count when user logs in
AdminSchema.methods.incrementLoginCount = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.loginCount += 1;
        return this.save();
    });
};
// Generate a JWT token
AdminSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id }, process.env.SECRET_KEY, {
    // expiresIn: "1d",
    });
    return token;
};
// Static method to find by token
AdminSchema.statics.findByToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return this.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id).exec();
        }
        catch (err) {
            throw new Error(`Error verifying token: ${err.message}`);
        }
    });
};
// Create password reset token
AdminSchema.methods.createPasswordResetToken =
    function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resettoken = crypto_1.default.randomBytes(32).toString("hex");
            this.passwordResetToken = crypto_1.default
                .createHash("sha256")
                .update(resettoken)
                .digest("hex");
            this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
            return resettoken;
        });
    };
// Create access token
AdminSchema.methods.createAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, name: this.name, email: this.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};
// Create refresh token
AdminSchema.methods.createRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, name: this.name, email: this.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};
// Define the Admin model
const Admin = mongoose_1.default.models.admins || mongoose_1.default.model("admins", AdminSchema);
exports.default = Admin;
