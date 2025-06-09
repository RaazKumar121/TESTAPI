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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Define the User schema
const UserSchema = new mongoose_1.Schema({
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
    mobile: {
        type: Number,
    },
    dob: {
        type: String,
    },
    gender: {
        type: String,
    },
    address: {
        type: String,
    },
    refered_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    refercode: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    deposit: {
        type: Number,
        required: true,
        default: 0,
    },
    bonus: {
        type: Number,
        required: true,
        default: 0,
    },
    logo: {
        type: String,
        required: false,
    },
    device_tokens: [{ type: String }],
    status: {
        type: Number,
        default: constants_1.UserStatus.ACTIVE,
        enum: [constants_1.UserStatus.ACTIVE, constants_1.UserStatus.INACTIVE, constants_1.UserStatus.BLOCKED],
    },
    password: {
        type: String,
        required: true,
        // minlength: [8, "Password must be at least 8 characters long"],
        // maxlength: [128, "Password must be less than 128 characters long"],
        // validate: {
        //   validator: function (value: string): boolean {
        //     // Require at least one uppercase letter, one lowercase letter, one special character and one number
        //     const regex =
        //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
        //     return regex.test(value);
        //   },
        //   message:
        //     "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        // },
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    dailySpinsLeft: {
        type: Number,
        default: 0,
    },
    spinClaimDate: {
        type: Date,
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
UserSchema.pre("save", function (next) {
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
UserSchema.methods.isPasswordMatched = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
// Increment login count when user logs in
UserSchema.methods.incrementLoginCount = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.loginCount += 1;
        return this.save();
    });
};
// Generate a JWT token
UserSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id }, process.env.SECRET_KEY, {
    // expiresIn: "1d",
    });
    return token;
};
// Static method to find by token
UserSchema.statics.findByToken = function (token) {
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
// Create access token
UserSchema.methods.createAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id || this.id, name: this.name, email: this.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};
// Create refresh token
UserSchema.methods.createRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id || this.id, name: this.name, email: this.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};
// Define the User model
const User = mongoose_1.default.models.users || mongoose_1.default.model("users", UserSchema);
exports.default = User;
