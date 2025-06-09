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
const CheckinSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    prizeType: {
        type: String,
        enum: [
            constants_1.PrizeName.ADD_CASH,
            constants_1.PrizeName.BUY_LOTTERY,
            constants_1.PrizeName.FREE_LOTTERY,
            constants_1.PrizeName.FREE_PHONE,
            constants_1.PrizeName.THAR,
            constants_1.PrizeName.TRY_AGAIN,
            constants_1.PrizeName.BETTER_LUCK,
            constants_1.PrizeName.BONUS,
        ],
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    // position: {
    //   type: Number,
    //   required: true,
    //   min: 1,
    //   max: 8,
    //   unique: true,
    // },
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
const Checkin = mongoose_1.default.models.checkins ||
    mongoose_1.default.model("checkins", CheckinSchema);
exports.default = Checkin;
