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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
// Define the User schema
const UserBankSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    ifsc: {
        type: String,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    status: {
        type: Number,
        default: constants_1.UserStatus.ACTIVE,
        enum: [constants_1.UserStatus.ACTIVE, constants_1.UserStatus.INACTIVE, constants_1.UserStatus.BLOCKED],
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
// Define the User model
const UserBank = mongoose_1.default.models.user_banks ||
    mongoose_1.default.model("user_banks", UserBankSchema);
exports.default = UserBank;
