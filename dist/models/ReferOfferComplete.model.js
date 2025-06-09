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
const ReferOfferCompleteSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    offer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "refer_offers",
        required: true,
    },
    referer: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" }],
        required: true,
    },
    is_complete: {
        type: Boolean,
        required: true,
        default: false,
    },
    first_name: String,
    last_name: String,
    aadhar: Number,
    city: String,
    state: String,
    pincode: Number,
    gender: String,
    status: {
        type: Number,
        default: constants_1.Status.ACTIVE,
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
const ReferOfferComplete = mongoose_1.default.models.refer_offers_complete ||
    mongoose_1.default.model("refer_offers_complete", ReferOfferCompleteSchema);
exports.default = ReferOfferComplete;
