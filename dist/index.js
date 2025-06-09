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
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const Auth_routes_1 = __importDefault(require("./routes/Auth.routes"));
const db_1 = __importDefault(require("./config/db"));
const Error_1 = __importDefault(require("./middlewares/Error"));
const App_routes_1 = __importDefault(require("./routes/App.routes"));
const User_model_1 = __importDefault(require("./models/User.model"));
const Auth_routes_2 = __importDefault(require("./routes/admin/Auth.routes"));
const App_routes_2 = __importDefault(require("./routes/admin/App.routes"));
const helpers_1 = require("./helpers");
// Load environment variables
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.disable("x-powered-by");
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Schedule a cron job to run at midnight (00:00)
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Reset dailySpinsLeft to 5 for all users
        yield User_model_1.default.updateMany({}, { $set: { dailySpinsLeft: 1 } });
        console.log("All user spins have been reset to 5");
    }
    catch (error) {
        console.error("Error resetting spins:", error);
    }
}));
// Root route
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const clickId = await generateClickId();
    let data = yield (0, helpers_1.generateReferCode)();
    // next();
    res.json({ message: "Working" });
}));
// // API v1 routes
// app.get("/v1", (req: Request, res: Response) => {
//   res.json({ message: "Welcome" });
// });
app.use("/v1", App_routes_1.default);
app.use("/v1/auth", Auth_routes_1.default);
// Admin routes
app.use("/v1/admin/auth", Auth_routes_2.default);
app.use("/v1/admin/", App_routes_2.default);
app.use(Error_1.default);
// Database connection and server start
(0, db_1.default)()
    .then(() => {
    try {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server connected to http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.log("Cannot connect to the server: ", error);
    }
})
    .catch((error) => {
    console.log("Invalid database connection: ", error);
});
