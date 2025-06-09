"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../../middlewares/Auth");
const Task_controller_1 = require("../../controllers/Task.controller");
const Lottery_controller_1 = require("../../controllers/Lottery.controller");
const User_controller_1 = require("../../controllers/User.controller");
const Setting_controller_1 = require("../../controllers/Setting.controller");
const Coupon_controller_1 = require("../../controllers/Coupon.controller");
const Gift_controller_1 = require("../../controllers/Gift.controller");
const WeeklyCheckin_controller_1 = require("../../controllers/WeeklyCheckin.controller");
const Home_controller_1 = require("../../controllers/Home.controller");
const Page_controller_1 = require("../../controllers/Page.controller");
const LotteryOffer_controller_1 = require("../../controllers/LotteryOffer.controller");
const DepositOffer_controller_1 = require("../../controllers/DepositOffer.controller");
const Offer_controller_1 = require("../../controllers/Offer.controller");
const ReferOffer_controller_1 = require("../../controllers/ReferOffer.controller");
const Deposit_controller_1 = require("../../controllers/Deposit.controller");
const ReferRule_controller_1 = require("../../controllers/ReferRule.controller");
const Spin_controller_1 = require("../../controllers/Spin.controller");
const Checkin_controller_1 = require("../../controllers/Checkin.controller");
// Create an instance of express.Router
const AppRoutes = express_1.default.Router();
// Task routes
AppRoutes.route("/task").post(Auth_1.isAdmin, Task_controller_1.createTask).get(Auth_1.isAdmin, Task_controller_1.getAllTask);
AppRoutes.route("/task/:id")
    .put(Auth_1.isAdmin, Task_controller_1.updateTask)
    .get(Auth_1.isAdmin, Task_controller_1.getTaskById)
    .delete(Auth_1.isAdmin, Task_controller_1.deleteTask);
AppRoutes.route("/task/status/:id").put(Auth_1.isAdmin, Task_controller_1.updateTaskStatus);
// offers routes
AppRoutes.route("/lottery")
    .post(Auth_1.isAdmin, Lottery_controller_1.createLottery)
    .get(Auth_1.isAdmin, Lottery_controller_1.getAllLottery);
AppRoutes.route("/lottery/coupon/:id").put(Auth_1.isAdmin, Lottery_controller_1.updateLotteryIsCoupon);
AppRoutes.route("/lottery/bonus/:id").put(Auth_1.isAdmin, Lottery_controller_1.updateLotteryIsBonus);
AppRoutes.route("/lottery/status/:id").put(Auth_1.isAdmin, Lottery_controller_1.updateLotteryStatus);
AppRoutes.route("/lottery/win/:id").put(Auth_1.isAdmin, Lottery_controller_1.updateLotteryWin);
AppRoutes.route("/lottery/:id")
    .put(Auth_1.isAdmin, Lottery_controller_1.updateLottery)
    .get(Auth_1.isAdmin, Lottery_controller_1.getLotteryById)
    .delete(Auth_1.isAdmin, Lottery_controller_1.deleteLottery);
// coupon routes
AppRoutes.route("/coupon")
    .post(Auth_1.isAdmin, Coupon_controller_1.createCoupon)
    .get(Auth_1.isAdmin, Coupon_controller_1.getAllCoupon);
AppRoutes.route("/coupon/:id")
    .put(Auth_1.isAdmin, Coupon_controller_1.updateCoupon)
    .get(Auth_1.isAdmin, Coupon_controller_1.getCouponById)
    .delete(Auth_1.isAdmin, Coupon_controller_1.deleteCoupon);
AppRoutes.route("/coupon/status/:id").put(Auth_1.isAdmin, Coupon_controller_1.updateCouponStatus);
//  Offers routes
AppRoutes.route("/offer").post(Auth_1.isAdmin, Offer_controller_1.createOffer).get(Auth_1.isAdmin, Offer_controller_1.getAllOffer);
AppRoutes.route("/offer/:id")
    .put(Auth_1.isAdmin, Offer_controller_1.updateOffer)
    .get(Auth_1.isAdmin, Offer_controller_1.getOfferById)
    .delete(Auth_1.isAdmin, Offer_controller_1.deleteOffer);
AppRoutes.route("/offer/status/:id").put(Auth_1.isAdmin, Offer_controller_1.updateOfferStatus);
//  Refer Offer routes
AppRoutes.route("/refer-offer")
    .post(Auth_1.isAdmin, ReferOffer_controller_1.createReferOffer)
    .get(Auth_1.isAdmin, ReferOffer_controller_1.getAllReferOffer);
AppRoutes.route("/refer-offer/:id")
    .put(Auth_1.isAdmin, ReferOffer_controller_1.updateReferOffer)
    .get(Auth_1.isAdmin, ReferOffer_controller_1.getReferOfferById)
    .delete(Auth_1.isAdmin, ReferOffer_controller_1.deleteReferOffer);
AppRoutes.route("/refer-offer/status/:id").put(Auth_1.isAdmin, ReferOffer_controller_1.updateReferOfferStatus);
// Lottery Offers routes
AppRoutes.route("/lottery-offer")
    .post(Auth_1.isAdmin, LotteryOffer_controller_1.createLotteryOffer)
    .get(Auth_1.isAdmin, LotteryOffer_controller_1.getAllLotteryOffer);
AppRoutes.route("/lottery-offer/:id")
    .put(Auth_1.isAdmin, LotteryOffer_controller_1.updateLotteryOffer)
    .get(Auth_1.isAdmin, LotteryOffer_controller_1.getLotteryOfferById)
    .delete(Auth_1.isAdmin, LotteryOffer_controller_1.deleteLotteryOffer);
AppRoutes.route("/lottery-offer/status/:id").put(Auth_1.isAdmin, LotteryOffer_controller_1.updateLotteryOfferStatus);
// Deposit Offers routes
AppRoutes.route("/deposit-offer")
    .post(Auth_1.isAdmin, DepositOffer_controller_1.createDepositOffer)
    .get(Auth_1.isAdmin, DepositOffer_controller_1.getAllDepositOffer);
AppRoutes.route("/deposit-offer/:id")
    .put(Auth_1.isAdmin, DepositOffer_controller_1.updateDepositOffer)
    .get(Auth_1.isAdmin, DepositOffer_controller_1.getDepositOfferById)
    .delete(Auth_1.isAdmin, DepositOffer_controller_1.deleteDepositOffer);
AppRoutes.route("/deposit-offer/status/:id").put(Auth_1.isAdmin, DepositOffer_controller_1.updateDepositOfferStatus);
// Gift routes
AppRoutes.route("/gift").post(Auth_1.isAdmin, Gift_controller_1.createGift).get(Auth_1.isAdmin, Gift_controller_1.getAllGift);
AppRoutes.route("/gift/:id")
    .put(Auth_1.isAdmin, Gift_controller_1.updateGift)
    .get(Auth_1.isAdmin, Gift_controller_1.getGiftById)
    .delete(Auth_1.isAdmin, Gift_controller_1.deleteGift);
AppRoutes.route("/gift/status/:id").put(Auth_1.isAdmin, Gift_controller_1.updateGiftStatus);
// Weekly Checkin
AppRoutes.route("/weekly/checkin")
    .post(Auth_1.isAdmin, WeeklyCheckin_controller_1.createWeeklyCheckin)
    .get(Auth_1.isAdmin, WeeklyCheckin_controller_1.getAllWeeklyCheckin);
AppRoutes.route("/weekly/checkin/:id")
    .put(Auth_1.isAdmin, WeeklyCheckin_controller_1.updateWeeklyCheckin)
    .get(Auth_1.isAdmin, WeeklyCheckin_controller_1.getWeeklyCheckinById)
    .delete(Auth_1.isAdmin, WeeklyCheckin_controller_1.deleteWeeklyCheckin);
// // users routes
AppRoutes.route("/user").get(Auth_1.isAdmin, User_controller_1.getAllUser);
AppRoutes.route("/user/status/:id").put(Auth_1.isAdmin, User_controller_1.updateUserStatus);
// // Setting Routes
AppRoutes.route("/setting")
    .get(Auth_1.isAdmin, Setting_controller_1.getAllSetting)
    .post(Auth_1.isAdmin, Setting_controller_1.createSetting);
AppRoutes.route("/setting/:id").put(Auth_1.isAdmin, Setting_controller_1.updateSetting);
AppRoutes.route("/home")
    .get(Home_controller_1.getAllHome)
    .post(Auth_1.isAdmin, Home_controller_1.createHome);
AppRoutes.route("/home/:id")
    .get(Auth_1.isAdmin, Home_controller_1.getHomeById)
    .put(Auth_1.isAdmin, Home_controller_1.updateHome)
    .delete(Auth_1.isAdmin, Home_controller_1.deleteHome);
AppRoutes.route("/page")
    .get(Auth_1.isAdmin, Page_controller_1.getAllPage)
    .post(Auth_1.isAdmin, Page_controller_1.createPage);
AppRoutes.route("/page/:id")
    .get(Auth_1.isAdmin, Page_controller_1.getPageById)
    .put(Auth_1.isAdmin, Page_controller_1.updatePage)
    .delete(Auth_1.isAdmin, Page_controller_1.deletePage);
AppRoutes.route("/deposit").get(Auth_1.isAdmin, Deposit_controller_1.getPendingDeposit);
AppRoutes.route("/deposit/:id").get(Auth_1.isAdmin, Deposit_controller_1.getDepositById);
AppRoutes.route("/deposit/status/:id").put(Auth_1.isAdmin, Deposit_controller_1.updateDepositStatus);
AppRoutes.route("/refer-rule")
    .get(Auth_1.isAdmin, ReferRule_controller_1.getAllReferRule)
    .post(Auth_1.isAdmin, ReferRule_controller_1.createReferRule);
AppRoutes.route("/refer-rule/:id")
    .get(Auth_1.isAdmin, ReferRule_controller_1.getReferRuleById)
    .put(Auth_1.isAdmin, ReferRule_controller_1.updateReferRule)
    .delete(Auth_1.isAdmin, ReferRule_controller_1.deleteReferRule);
AppRoutes.route("/spin").post(Auth_1.isAdmin, Spin_controller_1.createSpin).get(Auth_1.isAdmin, Spin_controller_1.getAllSpin);
AppRoutes.route("/spin/:id")
    .put(Auth_1.isAdmin, Spin_controller_1.updateSpin)
    .get(Auth_1.isAdmin, Spin_controller_1.getSpinById)
    .delete(Auth_1.isAdmin, Spin_controller_1.deleteSpin);
AppRoutes.route("/spin/status/:id").put(Auth_1.isAdmin, Spin_controller_1.updateSpinStatus);
AppRoutes.route("/checkin")
    .post(Auth_1.isAdmin, Checkin_controller_1.createCheckin)
    .get(Auth_1.isAdmin, Checkin_controller_1.getAllCheckin);
AppRoutes.route("/checkin/:id")
    .put(Auth_1.isAdmin, Checkin_controller_1.updateCheckin)
    .get(Auth_1.isAdmin, Checkin_controller_1.getCheckinById)
    .delete(Auth_1.isAdmin, Checkin_controller_1.deleteCheckin);
AppRoutes.route("/checkin/status/:id").put(Auth_1.isAdmin, Checkin_controller_1.updateCheckinStatus);
// // Bonus
// AppRoutes.route("/bonus").get(isAdmin, getAllBonus);
// AppRoutes.route("/transaction").get(isAdmin, getAllTransaction);
// // Setting Routes
// AppRoutes.route("/withdraw").get(isAdmin, getPendingWithdraw as RequestHandler)
// AppRoutes.route("/withdraw/:id").get(isAdmin, getWithdrawById as RequestHandler)
// AppRoutes.route("/withdraw/status/:id").put(isAdmin, updateWithdrawStatus as RequestHandler)
// // AppRoutes.route("/setting/:id").put(isAdmin, updateSetting as RequestHandler)
// AppRoutes.route("/reports").get(getDashboardReport as RequestHandler)
// AppRoutes.route("/reports/chart").get(getDashboardAnlytics as RequestHandler)
// AppRoutes.route("/reports/users").get(getRecentUsers as RequestHandler)
// AppRoutes.route("/reports/payouts").get(getAllWithdraw as RequestHandler)
// AppRoutes.route("/pending/conversions").get(isAdmin,getPendingConversion as RequestHandler)
// AppRoutes.route("/conversions").get(isAdmin,getAllConversion as RequestHandler)
// AppRoutes.route("/conversion/:id").get(isAdmin, getConversionById as RequestHandler)
// AppRoutes.route("/conversion/status/:id").put(isAdmin, updateConversionStatus as RequestHandler)
exports.default = AppRoutes;
