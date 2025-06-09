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
const ConversionSchema = new mongoose_1.Schema({
    click: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "clicks",
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    offer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "offers",
        required: true,
    },
    conversion_id: {
        type: String,
        required: true,
    },
    event: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    payout: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        default: constants_1.ConversionType.SELF,
        enum: [constants_1.ConversionType.REFER, constants_1.ConversionType.SELF],
    },
    status: {
        type: Number,
        default: constants_1.ConversionStatus.PENDING,
        enum: [
            constants_1.ConversionStatus.APPROVED,
            constants_1.ConversionStatus.PENDING,
            constants_1.ConversionStatus.REJECTED,
        ],
    },
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
    timestamps: true,
});
const Conversion = mongoose_1.default.models.conversions ||
    mongoose_1.default.model("conversions", ConversionSchema);
exports.default = Conversion;
