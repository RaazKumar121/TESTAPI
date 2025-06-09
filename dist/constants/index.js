"use strict";
// Define enums for various statuses and types
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLDER_NAME = exports.ConversionStatus = exports.ConversionType = exports.ClickType = exports.UploadingType = exports.ReferType = exports.WithdrawType = exports.BonusType = exports.WithdrawStatus = exports.TransactionType = exports.TransactionStatus = exports.DepositType = exports.PageType = exports.GameStatus = exports.OfferStatus = exports.Gifts = exports.PrizeName = exports.OfferType = exports.CouponType = exports.WinningStatus = exports.LotteryStatus = exports.UserStatus = exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["ACTIVE"] = 1] = "ACTIVE";
    Status[Status["INACTIVE"] = 0] = "INACTIVE";
    Status[Status["BLOCKED"] = 3] = "BLOCKED";
})(Status || (exports.Status = Status = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["ACTIVE"] = 1] = "ACTIVE";
    UserStatus[UserStatus["INACTIVE"] = 0] = "INACTIVE";
    UserStatus[UserStatus["BLOCKED"] = 3] = "BLOCKED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var LotteryStatus;
(function (LotteryStatus) {
    LotteryStatus[LotteryStatus["ACTIVE"] = 1] = "ACTIVE";
    LotteryStatus[LotteryStatus["INACTIVE"] = 0] = "INACTIVE";
    LotteryStatus[LotteryStatus["EXPIRE"] = 3] = "EXPIRE";
})(LotteryStatus || (exports.LotteryStatus = LotteryStatus = {}));
var WinningStatus;
(function (WinningStatus) {
    WinningStatus["PENDING"] = "pending";
    WinningStatus["WIN"] = "win";
    WinningStatus["LOST"] = "lost";
})(WinningStatus || (exports.WinningStatus = WinningStatus = {}));
var CouponType;
(function (CouponType) {
    CouponType["COMMON"] = "common";
    CouponType["LOTTERY"] = "lottery";
    CouponType["DEPOSIT"] = "deposit";
})(CouponType || (exports.CouponType = CouponType = {}));
var OfferType;
(function (OfferType) {
    OfferType["QUENTITY"] = "quantity";
    OfferType["AMOUNT"] = "amount";
})(OfferType || (exports.OfferType = OfferType = {}));
var PrizeName;
(function (PrizeName) {
    PrizeName["FREE_PHONE"] = "free_phone";
    PrizeName["FREE_LOTTERY"] = "free_lottery";
    PrizeName["THAR"] = "thar";
    PrizeName["TRY_AGAIN"] = "try_again";
    PrizeName["ADD_CASH"] = "add_cash";
    PrizeName["BUY_LOTTERY"] = "buy_lottery";
    PrizeName["BETTER_LUCK"] = "better_luck";
    PrizeName["BONUS"] = "bonus";
    // CASH_1 = "cash_1",
    // FREE_SPIN = "free_spin",
    // OFF_100 = "off_100",
})(PrizeName || (exports.PrizeName = PrizeName = {}));
exports.Gifts = [
    {
        name: "Try Again",
        value: "try_again",
    },
    {
        name: "Off 25%",
        value: "off_25",
    },
    {
        name: "Off 50%",
        value: "off_50",
    },
    {
        name: "1 Lakh Cash",
        value: "cash_1",
    },
    {
        name: "Free Spin",
        value: "free_spin",
    },
    {
        name: "Off 100%",
        value: "off_100",
    },
    {
        name: "Add Cash",
        value: "add_cash",
    },
    {
        name: "Free IPhone",
        value: "free_phone",
    },
];
var OfferStatus;
(function (OfferStatus) {
    OfferStatus[OfferStatus["ACTIVE"] = 1] = "ACTIVE";
    OfferStatus[OfferStatus["INACTIVE"] = 0] = "INACTIVE";
    OfferStatus[OfferStatus["BLOCKED"] = 3] = "BLOCKED";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["ACTIVE"] = 1] = "ACTIVE";
    GameStatus[GameStatus["INACTIVE"] = 0] = "INACTIVE";
    GameStatus[GameStatus["BLOCKED"] = 3] = "BLOCKED";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
var PageType;
(function (PageType) {
    PageType["POLICY"] = "policy";
    PageType["TERMS"] = "terms";
})(PageType || (exports.PageType = PageType = {}));
var DepositType;
(function (DepositType) {
    DepositType["QR"] = "qr";
    DepositType["GT"] = "gt";
})(DepositType || (exports.DepositType = DepositType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["APPROVED"] = 1] = "APPROVED";
    TransactionStatus[TransactionStatus["PENDING"] = 0] = "PENDING";
    TransactionStatus[TransactionStatus["REJECTED"] = 2] = "REJECTED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["CREDIT"] = "credit";
    TransactionType["DEBIT"] = "debit";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var WithdrawStatus;
(function (WithdrawStatus) {
    WithdrawStatus[WithdrawStatus["APPROVED"] = 1] = "APPROVED";
    WithdrawStatus[WithdrawStatus["PENDING"] = 0] = "PENDING";
    WithdrawStatus[WithdrawStatus["REJECTED"] = 2] = "REJECTED";
})(WithdrawStatus || (exports.WithdrawStatus = WithdrawStatus = {}));
var BonusType;
(function (BonusType) {
    BonusType["REFER"] = "refer";
    BonusType["SIGNUP"] = "signup";
    BonusType["SPIN"] = "spin";
    BonusType["CHECK"] = "checkin";
})(BonusType || (exports.BonusType = BonusType = {}));
var WithdrawType;
(function (WithdrawType) {
    WithdrawType["UPI"] = "upi";
    WithdrawType["GIFTCARD"] = "giftcard";
    WithdrawType["BANK"] = "bank";
})(WithdrawType || (exports.WithdrawType = WithdrawType = {}));
var ReferType;
(function (ReferType) {
    ReferType["PERCENTAGE"] = "percentage";
    ReferType["FIXED"] = "fixed";
})(ReferType || (exports.ReferType = ReferType = {}));
var UploadingType;
(function (UploadingType) {
    UploadingType["SERVER"] = "server";
    UploadingType["CLOUDINARY"] = "cloudinary";
})(UploadingType || (exports.UploadingType = UploadingType = {}));
var ClickType;
(function (ClickType) {
    ClickType["SELF"] = "self";
    ClickType["REFER"] = "refer";
})(ClickType || (exports.ClickType = ClickType = {}));
var ConversionType;
(function (ConversionType) {
    ConversionType["SELF"] = "self";
    ConversionType["REFER"] = "refer";
})(ConversionType || (exports.ConversionType = ConversionType = {}));
var ConversionStatus;
(function (ConversionStatus) {
    ConversionStatus[ConversionStatus["APPROVED"] = 1] = "APPROVED";
    ConversionStatus[ConversionStatus["PENDING"] = 0] = "PENDING";
    ConversionStatus[ConversionStatus["REJECTED"] = 2] = "REJECTED";
})(ConversionStatus || (exports.ConversionStatus = ConversionStatus = {}));
exports.FOLDER_NAME = `/images/`;
