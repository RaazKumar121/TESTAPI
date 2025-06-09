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
exports.referBonusDeposit = void 0;
const constants_1 = require("../constants");
const ReferOffer_model_1 = __importDefault(require("../models/ReferOffer.model"));
const ReferOfferComplete_model_1 = __importDefault(require("../models/ReferOfferComplete.model"));
const referBonusDeposit = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, referer, amount, }) {
    if (!user || !referer || !amount) {
        return false;
    }
    try {
        // 🔹 1️⃣ पहले सभी ACTIVE ऑफ़र्स को फ़ेच करें
        const offers = yield ReferOffer_model_1.default.find({ status: constants_1.Status.ACTIVE });
        if (!offers.length) {
            return false;
        }
        // 🔹 2️⃣ सभी ऑफर्स को लूप में चेक करें और ReferOfferComplete को अपडेट करें
        for (const offer of offers) {
            let offerComplete = yield ReferOfferComplete_model_1.default.findOne({
                user: referer,
                offer: offer._id,
                is_complete: false,
                status: constants_1.Status.ACTIVE,
            });
            if (offerComplete) {
                // 🔹 3️⃣ अगर ऑफ़र पहले से मौजूद है, तो नए referer को add करो (अगर पहले से नहीं है तो)
                const already = offerComplete.referer.some((item) => item.toString() === user._id.toString());
                if (!already) {
                    offerComplete.referer.push(user._id);
                    yield offerComplete.save();
                }
            }
            else {
                // 🔹 4️⃣ अगर ऑफ़र पहले नहीं था, तो नया रिकॉर्ड बनाओ
                const newOfferComplete = new ReferOfferComplete_model_1.default({
                    user: referer,
                    offer: offer._id,
                    referer: [user._id],
                    is_complete: false,
                    status: constants_1.Status.ACTIVE,
                });
                yield newOfferComplete.save();
            }
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.referBonusDeposit = referBonusDeposit;
