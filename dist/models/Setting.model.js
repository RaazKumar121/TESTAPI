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
const SettingSchema = new mongoose_1.Schema({
    // daily_spin: Number,
    // daily_win: Number,
    platform_fee: Number,
    gst: Number,
    daily_cashout: Number,
    min_withdraw: Number,
    min_deposit: Number,
    refer_bonus: Number,
    signup_bonus: Number,
    refer_first_deposit: Number,
    refer_commision: Number,
    // refer_commission: Number,
    // refer_type: {
    //   type: String,
    //   default: ReferType.PERCENTAGE,
    //   enum: [ReferType.PERCENTAGE, ReferType.FIXED],
    // },
    admin_upi: String,
    uploading_type: {
        type: String,
        default: constants_1.UploadingType.CLOUDINARY,
        enum: [constants_1.UploadingType.CLOUDINARY, constants_1.UploadingType.SERVER],
    },
    rate_us: String,
    telegram: String,
    support: String,
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
const Setting = mongoose_1.default.models.settings ||
    mongoose_1.default.model("settings", SettingSchema);
exports.default = Setting;
