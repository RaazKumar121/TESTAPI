"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {
//   createCategory,
//   deleteCategory,
//   getAllCategoryUser,
//   getCategoryById,
//   updateCategory,
// } from "../controllers/Task.controller";
const Auth_1 = require("../middlewares/Auth");
const Game_controller_1 = require("../controllers/Game.controller");
const User_controller_1 = require("../controllers/User.controller");
const Setting_controller_1 = require("../controllers/Setting.controller");
const Page_controller_1 = require("../controllers/Page.controller");
const Transaction_controller_1 = require("../controllers/Transaction.controller");
const File_controller_1 = require("../controllers/File.controller");
const Home_controller_1 = require("../controllers/Home.controller");
const Lottery_controller_1 = require("../controllers/Lottery.controller");
const LotteryOffer_controller_1 = require("../controllers/LotteryOffer.controller");
const Main_controller_1 = require("../controllers/Main.controller");
const DepositOffer_controller_1 = require("../controllers/DepositOffer.controller");
const UserBank_controller_1 = require("../controllers/UserBank.controller");
const Withdraw_controller_1 = require("../controllers/Withdraw.controller");
const Deposit_controller_1 = require("../controllers/Deposit.controller");
const Offer_controller_1 = require("../controllers/Offer.controller");
const Bonus_controller_1 = require("../controllers/Bonus.controller");
const ReferOffer_controller_1 = require("../controllers/ReferOffer.controller");
const ReferRule_controller_1 = require("../controllers/ReferRule.controller");
const Spin_controller_1 = require("../controllers/Spin.controller");
const Checkin_controller_1 = require("../controllers/Checkin.controller");
const appRoutes = express_1.default.Router();
// apply coupon routes
appRoutes
    .route("/apply-coupon")
    .post(Auth_1.authMiddleware, User_controller_1.applyCoupon);
appRoutes
    .route("/remove-coupon")
    .post(Auth_1.authMiddleware, User_controller_1.removeCoupon);
appRoutes
    .route("/buy-lottery")
    .post(Auth_1.authMiddleware, Main_controller_1.buyLottery);
appRoutes
    .route("/my-lottery")
    .get(Auth_1.authMiddleware, Main_controller_1.getMyLottery);
appRoutes
    .route("/lottery")
    .get(Auth_1.authMiddleware, Lottery_controller_1.getAllLotteryUser);
appRoutes.route("/slot").get(Auth_1.authMiddleware, Lottery_controller_1.getAllSlotUser);
appRoutes
    .route("/lottery/:id")
    .get(Auth_1.authMiddleware, Lottery_controller_1.getLotteryById);
appRoutes
    .route("/lottery/task/:id")
    .get(Auth_1.authMiddleware, Lottery_controller_1.getLotteryTaskById);
appRoutes
    .route("/offer")
    .get(Auth_1.authMiddleware, Offer_controller_1.getAllOfferUser);
appRoutes
    .route("/offer/:id")
    .get(Auth_1.authMiddleware, Offer_controller_1.getOfferById);
appRoutes
    .route("/lottery-offer")
    .get(Auth_1.authMiddleware, LotteryOffer_controller_1.getAllLotteryOfferUser);
appRoutes
    .route("/lottery-offer/:id")
    .get(Auth_1.authMiddleware, LotteryOffer_controller_1.getLotteryOfferById);
appRoutes
    .route("/deposit-offer")
    .get(Auth_1.authMiddleware, DepositOffer_controller_1.getAllDepositOfferUser);
appRoutes
    .route("/deposit-offer/:id")
    .get(Auth_1.authMiddleware, DepositOffer_controller_1.getDepositOfferById);
appRoutes
    .route("/banks")
    .get(Auth_1.authMiddleware, UserBank_controller_1.getAllUserBankUser)
    .post(Auth_1.authMiddleware, UserBank_controller_1.createUserBank);
appRoutes
    .route("/banks/:id")
    .get(Auth_1.authMiddleware, UserBank_controller_1.getUserBankById)
    .put(Auth_1.authMiddleware, UserBank_controller_1.updateUserBank)
    .delete(Auth_1.authMiddleware, UserBank_controller_1.deleteUserBank);
appRoutes
    .route("/refer-offer")
    .get(Auth_1.authMiddleware, ReferOffer_controller_1.getAllReferOfferUser);
appRoutes
    .route("/complete/refer-offer")
    .post(Auth_1.authMiddleware, ReferOffer_controller_1.completeReferOffer);
appRoutes
    .route("/refer-rule")
    .get(Auth_1.authMiddleware, ReferRule_controller_1.getAllReferRuleUser);
appRoutes.route("/spin").get(Auth_1.authMiddleware, Spin_controller_1.getAllSpinUser);
appRoutes.route("/get-spin-result").get(Auth_1.authMiddleware, Spin_controller_1.claimSpin);
appRoutes.route("/checkin").get(Auth_1.authMiddleware, Checkin_controller_1.getAllCheckinUser);
appRoutes.route("/get-checkin-result").get(Auth_1.authMiddleware, Checkin_controller_1.claimCheckin);
// Category Routes
// appRoutes
//   .route("/category")
//   .get(getAllCategoryUser as RequestHandler)
//   .post(isAdmin, createCategory as RequestHandler);
// appRoutes
//   .route("/category/:id")
//   .get(getCategoryById as RequestHandler)
//   .put(updateCategory as RequestHandler)
//   .delete(deleteCategory as RequestHandler);
// Offer Routes
// Game Routes
appRoutes
    .route("/game")
    .get(Game_controller_1.getAllGame)
    .post(Auth_1.isAdmin, Game_controller_1.createGame);
appRoutes
    .route("/game/:id")
    .get(Game_controller_1.getGameById)
    .put(Game_controller_1.updateGame)
    .delete(Game_controller_1.deleteGame);
// User Routes
appRoutes
    .route("/my/details")
    .get(Auth_1.authMiddleware, User_controller_1.getUserDetails);
appRoutes
    .route("/my/referlist")
    .get(Auth_1.authMiddleware, User_controller_1.getUserReferList);
appRoutes
    .route("/my/transaction")
    .get(Auth_1.authMiddleware, Transaction_controller_1.getMyTransaction);
appRoutes
    .route("/my/withdraw")
    .get(Auth_1.authMiddleware, Withdraw_controller_1.getMyWithdraw);
appRoutes
    .route("/my/deposit")
    .get(Auth_1.authMiddleware, Deposit_controller_1.getMyDeposit);
appRoutes.route("/my/bonus").get(Auth_1.authMiddleware, Bonus_controller_1.getMyBonus);
// withdraw routes
appRoutes
    .route("/withdraw")
    .post(Auth_1.authMiddleware, User_controller_1.createWithdrawRequest);
appRoutes
    .route("/deposit")
    .post(Auth_1.authMiddleware, User_controller_1.createDepositRequest);
// Setting Routes
appRoutes
    .route("/setting")
    .get(Auth_1.authMiddleware, Setting_controller_1.getAllSetting);
// Page Routes
appRoutes
    .route("/page")
    .get(Auth_1.authMiddleware, Page_controller_1.getAllPage)
    .post(Auth_1.isAdmin, Page_controller_1.createPage);
appRoutes
    .route("/page/:id")
    .get(Page_controller_1.getPageById)
    .put(Page_controller_1.updatePage)
    .delete(Page_controller_1.deletePage);
appRoutes
    .route("/leaderboard")
    .get(Auth_1.authMiddleware, User_controller_1.getLeaderboard);
appRoutes.route("/upload/single").post(File_controller_1.uploadFile);
appRoutes.route("/upload/multi").post(File_controller_1.uploadImages);
// appRoutes
//   .route("/bonus/claim")
//   .get(authMiddleware, claimBonus as RequestHandler);
appRoutes
    .route("/update/logo")
    .put(Auth_1.authMiddleware, User_controller_1.updateUserLogo);
appRoutes
    .route("/update/profile")
    .put(Auth_1.authMiddleware, User_controller_1.updateUserProfile);
// Home
appRoutes.route("/home").get(Auth_1.authMiddleware, Home_controller_1.getAllHome);
exports.default = appRoutes;
