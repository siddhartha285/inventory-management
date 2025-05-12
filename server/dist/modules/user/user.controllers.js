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
const http_status_1 = __importDefault(require("http-status"));
const asyncHandler_1 = __importDefault(require("../../lib/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../lib/sendResponse"));
const user_services_1 = __importDefault(require("./user.services"));
class UserControllers {
    constructor() {
        this.services = user_services_1.default;
        // get self profile
        this.getSelf = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.getSelf(req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.CREATED,
                message: 'User profile retrieved successfully!',
                data: result
            });
        }));
        // register new account
        this.register = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.register(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.CREATED,
                message: 'User registered successfully!',
                data: result
            });
        }));
        // login into your registered account
        this.login = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.login(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'User login successfully!',
                data: result
            });
        }));
        // update profile
        this.updateProfile = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.updateProfile(req.user._id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'User Profile updated successfully!',
                data: result
            });
        }));
        // change Password
        this.changePassword = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.changePassword(req.user._id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'Password changed successfully!',
                data: result
            });
        }));
    }
}
const userControllers = new UserControllers();
exports.default = userControllers;
