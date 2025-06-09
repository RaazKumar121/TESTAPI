"use strict";
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
exports.getMyLottery = exports.buyLottery = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Lottery_model_1 = __importDefault(require("../models/Lottery.model"));
const constants_1 = require("../constants");
const Coupon_model_1 = __importDefault(require("../models/Coupon.model"));
const ApplyedCoupon_model_1 = __importDefault(require("../models/ApplyedCoupon.model"));
const MyLottery_model_1 = __importDefault(require("../models/MyLottery.model"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Offer_model_1 = __importDefault(require("../models/Offer.model"));
// export const buyLottery = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const {
//       lottery_id,
//       quantity,
//       promo_code_id,
//       offer_id,
//     } = req.body;
//     const userId = req.user;
//     if (!lottery_id || !quantity) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, message: "Please fill all details" });
//     }
//     // Fetch the user and check balance
//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: false, message: "User not found" });
//     }
//     const lottery = await Lottery.findOne({
//       id: lottery_id,
//       status: LotteryStatus.ACTIVE,
//     }).session(session);
//     if (!lottery) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: false, message: "Lottery not found" });
//     }
//     if (lottery.limit < quantity) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Quantity exceeds the limit",
//       });
//     }
//     if (lottery.sell_close_date < new Date()) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Sell close date is over",
//       });
//     }
//     const setting = await Setting.findOne();
//     // Calculate the total amount
//     let totalAmount = quantity * lottery.price;
//     const plateFormFee = totalAmount * (setting!.platform_fee / 100);
//     const gstAmount = totalAmount * (setting!.gst / 100);
//     const bonusDiscount = lottery.bonus_discount
//       ? totalAmount * (lottery.discount / 100)
//       : 0;
//     let promoDiscount = 0;
//     let totalDiscount = 0;
//     const myLottery = new MyLottery();
//     // Apply promo code discount
//     if (promo_code_id && lottery.coupon_discount) {
//       const applyed = await ApplyedCoupon.findOne({
//         user: userId,
//         coupon: promo_code_id,
//       }).session(session);
//       if (!applyed) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid promo code",
//         });
//       }
//       const promoCode = await Coupon.findOne({
//         id: promo_code_id,
//         status: Status.ACTIVE,
//       }).session(session);
//       if (!promoCode || promoCode.type == CouponType.DEPOSIT) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid promo code",
//         });
//       }
//       promoDiscount += totalAmount * (promoCode.value / 100);
//       myLottery.coupon = promoCode.id;
//     } else if (offer_id) {
//       const offer = await LotteryOffer.findOne({
//         id: offer_id,
//         status: Status.ACTIVE,
//       }).session(session);
//       if (!offer || offer.exclude_lottery == lottery_id) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid offer",
//         });
//       }
//       if (offer.type == OfferType.AMOUNT && offer.limit > totalAmount) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid offer",
//         });
//       } else if (offer.type == OfferType.QUENTITY && offer.limit > quantity) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid offer",
//         });
//       }
//       promoDiscount += totalAmount * (offer.value / 100);
//       myLottery.offer = offer.id;
//     }
//     if (bonusDiscount > user.bonus) {
//       totalAmount = totalAmount - user.bonus;
//       user.bonus = 0;
//     } else {
//       user.bonus = user.bonus - bonusDiscount;
//       totalAmount = totalAmount - bonusDiscount;
//     }
//     totalAmount = totalAmount - promoDiscount;
//     totalAmount = totalAmount + plateFormFee + gstAmount;
//     if (totalAmount > user.deposit) {
//       user.deposit = 0;
//       totalAmount = totalAmount - user.deposit;
//     } else {
//       user.deposit = user.deposit - totalAmount;
//       totalAmount = 0;
//     }
//     if (totalAmount > user.balance) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Insufficient balance",
//       });
//     } else {
//       user.balance = user.balance - totalAmount;
//     }
//     await user.save({ session });
//     myLottery.user = userId;
//     myLottery.lottery = lottery_id;
//     myLottery.order_id = `LOT-${Date.now()}`;
//     await myLottery.save({ session });
//     const newTransaction = new Transaction({
//       user: user,
//       order_id: myLottery.order_id,
//       amount: lottery.price,
//       type: TransactionType.DEBIT,
//       details: `Lottery purchase of ${lottery.price}`,
//       status: TransactionStatus.APPROVED,
//     });
//     await newTransaction.save({ session });
//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();
//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       message: "Lottery purchased successfully",
//       data: myLottery,
//       transaction: newTransaction,
//     });
//   } catch (error: any) {
//     console.log(error);
//     await session.abortTransaction();
//     session.endSession();
//     // next(error);
//     if (error instanceof mongoose.Error.ValidationError) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Validation error",
//         details: error.errors,
//       });
//     }
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "An unexpected error occurred",
//       error: error.message || "Unknown error",
//     });
//   }
// };
const buyLottery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { lottery_id, quantity, offer } = req.body;
        const userId = req.user;
        // console.log(req.body);
        if (!lottery_id || !quantity) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Please fill all details" });
        }
        // Fetch user
        const user = yield User_model_1.default.findById(userId).session(session);
        if (!user || user.status !== constants_1.Status.ACTIVE) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "User not found" });
        }
        // Fetch lottery
        const lottery = yield Lottery_model_1.default.findOne({
            _id: lottery_id,
            status: constants_1.LotteryStatus.ACTIVE,
        }).session(session);
        if (!lottery) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Lottery not found" });
        }
        const sold = yield MyLottery_model_1.default.find({ lottery: lottery_id }).countDocuments();
        if (lottery.limit < sold + quantity) {
            console.log("Quantity exceeds the limit");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Quantity exceeds the limit",
            });
        }
        if (lottery.sell_close_date < new Date()) {
            console.log("Sell close date is over");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Sell close date is over",
            });
        }
        // Fetch settings
        const setting = yield Setting_model_1.default.findOne();
        // Calculate total amount
        let totalAmount = quantity * lottery.price; //810
        const platformFee = totalAmount * (setting.platform_fee / 100); //20
        const gstAmount = totalAmount * (setting.gst / 100); // 145
        const bonusDiscount = lottery.bonus_discount
            ? quantity * lottery.discount
            : 0;
        let promoDiscount = 0;
        let couponId = null;
        let offerId = null;
        // Apply promo code
        if (offer) {
            console.log("Offer", offer);
            const applied = yield ApplyedCoupon_model_1.default.findOne({
                user: userId,
                _id: offer,
                status: constants_1.Status.INACTIVE,
            }).session(session);
            console.log("applied", applied);
            if (!applied) {
                console.log("Invalid promo code");
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: "Invalid promo code" });
            }
            if (applied.type == constants_1.CouponType.DEPOSIT) {
                console.log("Invalid promo code2");
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: "Invalid promo code" });
            }
            if (applied.mode == "coupon") {
                const promoCode = yield Coupon_model_1.default.findOne({
                    _id: applied.coupon,
                    status: constants_1.Status.ACTIVE,
                }).session(session);
                if (!promoCode || promoCode.type == constants_1.CouponType.DEPOSIT) {
                    console.log("Invalid promo code3");
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "Invalid promo code" });
                }
                couponId = promoCode.id;
                promoDiscount += totalAmount * (promoCode.value / 100);
            }
            else if (applied.mode == "offer") {
                const offer = yield Offer_model_1.default.findOne({
                    _id: applied.offer,
                    status: constants_1.Status.ACTIVE,
                }).session(session);
                if (!offer || offer.exclude_lottery == lottery_id) {
                    console.log("Invalid offer");
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "Invalid offer" });
                }
                if (offer.type == constants_1.OfferType.AMOUNT && offer.min_value > totalAmount) {
                    console.log("Invalid offer1");
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid offer",
                    });
                }
                else if (offer.type == constants_1.OfferType.QUENTITY &&
                    offer.min_value > quantity) {
                    console.log("Invalid offer2");
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid offer",
                    });
                }
                offerId = offer.id;
                promoDiscount += totalAmount * (offer.value / 100);
            }
        }
        totalAmount -= promoDiscount;
        totalAmount += platformFee + gstAmount;
        // Apply bonus discount
        if (bonusDiscount > user.bonus) {
            totalAmount -= user.bonus;
            user.bonus = 0;
        }
        else {
            user.bonus -= bonusDiscount;
            totalAmount -= bonusDiscount;
        }
        // Deduct from deposit first
        if (totalAmount <= user.deposit) {
            user.deposit -= totalAmount;
            totalAmount = 0;
        }
        else {
            totalAmount -= user.deposit;
            user.deposit = 0;
        }
        // Deduct from balance
        if (totalAmount > user.balance) {
            console.log("Insufficient balance");
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ success: false, message: "Insufficient balance" });
        }
        user.balance -= totalAmount;
        yield user.save({ session });
        let myLotteryEntries = [];
        let transactionEntries = [];
        for (let i = 0; i < quantity; i++) {
            const orderId = `LOT-${Date.now()}-${i + 1}`;
            const myLottery = new MyLottery_model_1.default({
                user: userId,
                lottery: lottery_id,
                order_id: orderId,
                coupon: couponId || null,
                offer: offerId || null,
            });
            myLotteryEntries.push(myLottery);
            const newTransaction = new Transaction_model_1.default({
                user: userId,
                order_id: orderId,
                amount: lottery.price,
                type: constants_1.TransactionType.DEBIT,
                details: `Lottery purchase of ${lottery.price}`,
                status: constants_1.TransactionStatus.APPROVED,
            });
            transactionEntries.push(newTransaction);
        }
        yield MyLottery_model_1.default.insertMany(myLotteryEntries, { session });
        yield Transaction_model_1.default.insertMany(transactionEntries, { session });
        yield ApplyedCoupon_model_1.default.findOneAndUpdate({
            user: userId,
            _id: offer,
        }, { status: constants_1.Status.ACTIVE }).session(session);
        // Commit transaction
        yield session.commitTransaction();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: `Lottery purchased successfully (${quantity} tickets)`,
            data: myLotteryEntries,
            transactions: transactionEntries,
        });
    }
    catch (error) {
        console.error(error);
        yield session.abortTransaction();
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Validation error",
                details: error.errors,
            });
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message || "Unknown error",
        });
    }
    finally {
        session.endSession();
    }
});
exports.buyLottery = buyLottery;
exports.getMyLottery = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield MyLottery_model_1.default.find({
            status: constants_1.Status.ACTIVE,
        }, {
            lottery: 1,
            createdAt: 1,
            winning_status: 1,
        })
            .populate("lottery", "name prize sell_close_date start_date result_date cross_price price is_free ticket")
            .sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
