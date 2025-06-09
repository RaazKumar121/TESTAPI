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
const OfferSchema = new mongoose_1.Schema({
    exclude_lottery: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "lotteries",
        default: null,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    min_value: {
        type: Number,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
        default: 1,
    },
    type: {
        type: String,
        required: true,
        default: constants_1.OfferType.AMOUNT,
        enum: [constants_1.OfferType.AMOUNT, constants_1.OfferType.QUENTITY],
    },
    mode: {
        type: String,
        required: true,
        default: constants_1.CouponType.LOTTERY,
        enum: [constants_1.CouponType.DEPOSIT, constants_1.CouponType.LOTTERY],
    },
    status: {
        type: Number,
        default: constants_1.Status.INACTIVE,
        enum: [constants_1.Status.ACTIVE, constants_1.Status.BLOCKED, constants_1.Status.INACTIVE],
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
const Offer = mongoose_1.default.models.offers || mongoose_1.default.model("offers", OfferSchema);
exports.default = Offer;
