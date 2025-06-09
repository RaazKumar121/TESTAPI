"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// errors/CustomAPIError.ts
class CustomAPIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.default = CustomAPIError;
