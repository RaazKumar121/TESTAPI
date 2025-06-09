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
const LotterySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
    prize: {
        type: Number,
        required: true,
    },
    slot_type: {
        type: Number,
        default: 1,
    },
    ticket: {
        type: String,
        required: true,
    },
    winning_note: {
        type: String,
        required: true,
    },
    banners: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cross_price: {
        type: Number,
        required: true,
    },
    winners: [
        {
            level: {
                type: Number,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
    coupon_discount: {
        type: Boolean,
        default: false,
    },
    bonus_discount: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        default: 0,
    },
    limit: {
        type: Number,
        default: 0,
    },
    is_free: {
        type: Boolean,
        default: false,
    },
    is_slot: {
        type: Boolean,
        default: false,
    },
    first_prize: {
        type: Number,
        default: 0,
    },
    free_task: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "tasks",
    },
    instant_win: {
        type: Boolean,
        default: false,
    },
    start_date: {
        type: Date,
        required: true,
    },
    result_date: {
        type: Date,
        required: true,
    },
    sell_close_date: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        default: constants_1.LotteryStatus.INACTIVE,
        enum: [
            constants_1.LotteryStatus.ACTIVE,
            constants_1.LotteryStatus.EXPIRE,
            constants_1.LotteryStatus.INACTIVE,
        ],
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
const Lottery = mongoose_1.default.models.lotteries ||
    mongoose_1.default.model("lotteries", LotterySchema);
exports.default = Lottery;
