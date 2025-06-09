"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Global Error-Handling Middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    // console.error(err);
    res.status(statusCode).json(Object.assign({ success: false, message: err.message || "Internal Server Error" }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
};
exports.default = errorHandler;
