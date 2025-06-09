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
const MyLotterySchema = new mongoose_1.Schema({
    lottery: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "lotteries",
        default: null,
        required: false,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        default: null,
        required: false,
    },
    offer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "lottery_offers",
        default: null,
        required: false,
    },
    coupon: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "coupons",
        default: null,
        required: false,
    },
    // lottery_no: {
    //   type: Number,
    //   required: true,
    // },
    order_id: {
        type: String,
        required: true,
    },
    winning_status: {
        type: String,
        default: constants_1.WinningStatus.PENDING,
        enum: [constants_1.WinningStatus.PENDING, constants_1.WinningStatus.WIN, constants_1.WinningStatus.LOST],
    },
    winning_rank: {
        type: Number,
        default: 0,
    },
    winning_prize: {
        type: Number,
        default: 0,
    },
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
            // delete ret.createdAt;
            // delete ret.updatedAt;
            delete ret.__v;
        },
    },
    timestamps: true,
});
const MyLottery = mongoose_1.default.models.my_lotteries ||
    mongoose_1.default.model("my_lotteries", MyLotterySchema);
exports.default = MyLottery;
