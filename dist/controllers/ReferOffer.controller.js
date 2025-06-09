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
exports.completeReferOffer = exports.deleteReferOffer = exports.updateReferOffer = exports.updateReferOfferStatus = exports.getReferOfferById = exports.createReferOffer = exports.getAllReferOfferUser = exports.getAllReferOffer = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ReferOffer_model_1 = __importDefault(require("../models/ReferOffer.model"));
const validator_1 = __importDefault(require("../helpers/validator"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
const ReferOfferComplete_model_1 = __importDefault(require("../models/ReferOfferComplete.model"));
// Get all data
exports.getAllReferOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield ReferOffer_model_1.default.find();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        // console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Get all data
exports.getAllReferOfferUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id; // यूज़र का ID
    try {
        const offers = yield ReferOffer_model_1.default.find({ status: constants_1.Status.ACTIVE });
        const offerDetails = yield ReferOfferComplete_model_1.default.aggregate([
            {
                $match: { user: userId },
            },
            {
                $group: {
                    _id: "$offer",
                    refererCount: { $sum: { $size: "$referer" } }, // रेफ़रर की संख्या
                    isComplete: { $max: "$is_complete" }, // पूरा हुआ है या नहीं
                },
            },
        ]);
        // ऑफर को मैप करके referer count और complete status जोड़ना
        const result = offers.map((offer) => {
            const details = offerDetails.find((d) => d._id.toString() === offer._id.toString());
            return {
                id: details._id,
                name: offer === null || offer === void 0 ? void 0 : offer.name,
                prize: offer === null || offer === void 0 ? void 0 : offer.prize,
                title: offer === null || offer === void 0 ? void 0 : offer.title,
                desc: offer === null || offer === void 0 ? void 0 : offer.desc,
                logo: offer === null || offer === void 0 ? void 0 : offer.logo,
                winning_text: offer === null || offer === void 0 ? void 0 : offer.winning_text,
                goal: offer === null || offer === void 0 ? void 0 : offer.goal,
                deposit: offer === null || offer === void 0 ? void 0 : offer.deposit,
                status: offer === null || offer === void 0 ? void 0 : offer.status,
                refererCount: details ? details.refererCount : 0,
                isComplete: details ? details.isComplete : false,
            };
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: result,
            message: "Data retrieved successfully",
        });
        return;
    }
    catch (err) {
        // console.log(err);
        next(err); // Pass the error to the global error handler, if you have one
    }
}));
// Create a new data
exports.createReferOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, prize, title, desc, winning_text, goal, deposit, logo, status, } = req.body;
    if (!name ||
        !prize ||
        !title ||
        !desc ||
        !winning_text ||
        !goal ||
        !deposit ||
        !logo ||
        !status) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield ReferOffer_model_1.default.create({
            name,
            prize,
            title,
            desc,
            winning_text,
            goal,
            deposit,
            logo,
            status,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            data: data,
            message: "ReferOffer created successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Get data by ID
exports.getReferOfferById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield ReferOffer_model_1.default.findById(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "ReferOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: data,
            message: "ReferOffer retrieved successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateReferOfferStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.BadRequestError("Invalid status");
        }
        const data = yield ReferOffer_model_1.default.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "ReferOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "ReferOffer updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Update data by ID
exports.updateReferOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    const { name, prize, title, desc, winning_text, goal, deposit, logo, status, } = req.body;
    if (!name ||
        !prize ||
        !title ||
        !desc ||
        !winning_text ||
        !goal ||
        !deposit ||
        !logo ||
        !status) {
        res
            .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ success: false, message: "please fill all required fields" });
        return;
    }
    try {
        const data = yield ReferOffer_model_1.default.findByIdAndUpdate(req.params.id, {
            name,
            prize,
            title,
            desc,
            winning_text,
            goal,
            deposit,
            logo,
            status,
        }, {
            new: true,
            runValidators: true, // Ensure validators are applied during update
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "ReferOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
            success: true,
            data: data,
            message: "ReferOffer updated successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
// Delete data by ID
exports.deleteReferOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validator_1.default)(req.params.id);
    try {
        const data = yield ReferOffer_model_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "ReferOffer not found",
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
            success: true,
            message: "ReferOffer deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
exports.completeReferOffer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    console.log(req.body);
    const { first_name, last_name, aadhar, city, state, pincode, gender, offerId, } = req.body;
    // ✅ सभी आवश्यक फ़ील्ड्स की जाँच करें
    if (!first_name ||
        !last_name ||
        !aadhar ||
        !city ||
        !state ||
        !pincode ||
        !gender ||
        !offerId) {
        res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: "Please fill all required fields",
        });
        return;
    }
    try {
        // ✅ ऑफ़र को खोजें
        const offer = yield ReferOffer_model_1.default.findOne({
            status: constants_1.Status.ACTIVE,
            _id: offerId,
        });
        if (!offer) {
            throw new errors_1.BadRequestError("Invalid offer");
        }
        // ✅ ऑफ़र को पूरा करने की एंट्री खोजें
        const completOffer = yield ReferOfferComplete_model_1.default.findOne({
            user: userId,
            offer: offerId,
            status: constants_1.Status.ACTIVE,
        });
        if (!completOffer) {
            throw new errors_1.BadRequestError("Offer completion record not found");
        }
        // ✅ पहले से पूरा हो चुका ऑफ़र फिर से पूरा नहीं कर सकते
        if (completOffer.is_complete) {
            throw new errors_1.BadRequestError("Offer is already completed");
        }
        // ✅ ऑफ़र पूरा करने के लिए referer की ज़रूरत है
        if (!completOffer.referer || completOffer.referer.length < offer.goal) {
            throw new errors_1.BadRequestError("Please first complete offer");
        }
        // ✅ ऑफ़र को पूरा करें
        completOffer.is_complete = true;
        yield completOffer.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: completOffer,
            message: "Offer completed successfully",
        });
        return;
    }
    catch (err) {
        next(err);
    }
}));
