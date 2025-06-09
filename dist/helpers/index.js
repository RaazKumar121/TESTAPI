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
exports.generateCouponCode = exports.generateOrderId = exports.hashPassword = exports.generateOtp = exports.generateClickId = exports.generatePasswordToken = exports.generateReferCode = exports.getUserDeposit = exports.getUserCashout = void 0;
exports.generateAndStoreIds = generateAndStoreIds;
exports.checkForDuplicates = checkForDuplicates;
const Withdraw_model_1 = __importDefault(require("../models/Withdraw.model"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Deposit_model_1 = __importDefault(require("../models/Deposit.model"));
const constants_1 = require("../constants");
let generatedIds = new Set();
const getUserCashout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the userId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid userId format");
        }
        // Use aggregation to sum the amount for the given userId
        const result = yield Withdraw_model_1.default.aggregate([
            {
                $match: { user: new mongoose_1.default.Types.ObjectId(userId) }, // Match withdraws by user ID (convert to ObjectId if needed)
            },
            {
                $group: {
                    _id: null, // We don't need to group by anything other than the sum
                    totalAmount: { $sum: "$amount" }, // Sum the 'amount' field
                },
            },
        ]);
        // If there are no withdrawals for the user, return 0
        return result.length > 0 ? result[0].totalAmount : 0;
    }
    catch (error) {
        console.error("Error fetching total withdraw amount:", error);
        throw new Error(error.message || "Error fetching total withdraw amount");
    }
});
exports.getUserCashout = getUserCashout;
const getUserDeposit = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the userId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid userId format");
        }
        // Use aggregation to sum the amount for the given userId
        const result = yield Deposit_model_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userId),
                    status: constants_1.TransactionStatus.APPROVED,
                }, // Match withdraws by user ID (convert to ObjectId if needed)
            },
            {
                $group: {
                    _id: null, // We don't need to group by anything other than the sum
                    totalAmount: { $sum: "$amount" }, // Sum the 'amount' field
                },
            },
        ]);
        // If there are no withdrawals for the user, return 0
        return result.length > 0 ? result[0].totalAmount : 0;
    }
    catch (error) {
        console.error("Error fetching total withdraw amount:", error);
        throw new Error(error.message || "Error fetching total withdraw amount");
    }
});
exports.getUserDeposit = getUserDeposit;
const generateReferCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueId = (0, uuid_1.v4)();
    const formattedId = uniqueId.replace(/-/g, "").toUpperCase();
    return formattedId;
});
exports.generateReferCode = generateReferCode;
const generatePasswordToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueId = (0, uuid_1.v4)();
    return uniqueId;
});
exports.generatePasswordToken = generatePasswordToken;
const generateClickId = () => __awaiter(void 0, void 0, void 0, function* () {
    let uniqueId;
    do {
        uniqueId = (0, uuid_1.v4)();
    } while (generatedIds.has(uniqueId)); // Check if this ID already exists
    generatedIds.add(uniqueId); // Store this ID to avoid future collisions
    return "RK-" + uniqueId.replace(/-/g, "").toUpperCase(); // Format it
});
exports.generateClickId = generateClickId;
function generateAndStoreIds() {
    return __awaiter(this, void 0, void 0, function* () {
        const ids = [];
        // Generate 10,000 unique IDs
        for (let i = 0; i < 100000; i++) {
            const uniqueId = yield (0, exports.generateClickId)();
            ids.push(uniqueId);
        }
        // Write the generated IDs to a JSON file
        try {
            fs_1.default.writeFileSync("generated_ids.json", JSON.stringify(ids, null, 2), "utf-8");
            console.log("IDs saved to generated_ids.json");
        }
        catch (error) {
            console.error("Error writing to file:", error);
        }
    });
}
function checkForDuplicates() {
    try {
        // Read the JSON file
        const data = fs_1.default.readFileSync("generated_ids.json", "utf-8");
        const ids = JSON.parse(data); // Parse the JSON file content
        // Use a Set to track seen IDs
        let seenIds = new Set();
        let duplicates = [];
        // Loop through each ID and check if it already exists in the Set
        for (const id of ids) {
            if (seenIds.has(id)) {
                duplicates.push(id); // If duplicate, add to the duplicates array
            }
            else {
                seenIds.add(id); // Otherwise, add the ID to the Set
            }
        }
        // If there are duplicates, log them
        if (duplicates.length > 0) {
            console.log("Duplicate IDs found:", duplicates);
        }
        else {
            console.log("No duplicates found.");
        }
    }
    catch (error) {
        console.error("Error reading or parsing the JSON file:", error);
    }
}
const generateOtp = (length) => __awaiter(void 0, void 0, void 0, function* () {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
});
exports.generateOtp = generateOtp;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hash = yield bcryptjs_1.default.hash(password, salt);
    return hash;
});
exports.hashPassword = hashPassword;
const generateOrderId = (prefix) => {
    const timestamp = Date.now().toString().slice(-6); // लास्ट 6 अंक (माइक्रोसेकंड्स के लिए यूनिक)
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4-अंकों की रैंडम स्ट्रिंग
    const uniqueId = (0, uuid_1.v4)().split("-")[0].toUpperCase(); // UUID से पहला हिस्सा
    return `${prefix}-${timestamp}${randomStr}${uniqueId}`;
};
exports.generateOrderId = generateOrderId;
const generateCouponCode = (prefix) => {
    const timestamp = Date.now().toString().slice(-6); // लास्ट 6 अंक (माइक्रोसेकंड्स के लिए यूनिक)
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4-अंकों की रैंडम स्ट्रिंग
    const uniqueId = (0, uuid_1.v4)().split("-")[0].toUpperCase(); // UUID से पहला हिस्सा
    return `${prefix}${timestamp}${randomStr}${uniqueId}`;
};
exports.generateCouponCode = generateCouponCode;
