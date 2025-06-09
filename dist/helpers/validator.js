"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Function to validate MongoDB ObjectId
const validateMongoDbId = (id) => {
    const isValid = mongoose_1.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("This id is not valid or not found");
    }
};
exports.default = validateMongoDbId;
