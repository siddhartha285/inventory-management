"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("./user.controllers"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validator_1 = __importDefault(require("./user.validator"));
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const userRoutes = (0, express_1.Router)();
userRoutes.post('/register', (0, validateRequest_1.default)(user_validator_1.default.registerSchema), user_controllers_1.default.register);
userRoutes.post('/login', (0, validateRequest_1.default)(user_validator_1.default.loginSchema), user_controllers_1.default.login);
userRoutes.get('/self', verifyAuth_1.default, user_controllers_1.default.getSelf);
userRoutes.post('/change-password', verifyAuth_1.default, (0, validateRequest_1.default)(user_validator_1.default.changePasswordSchema), user_controllers_1.default.changePassword);
userRoutes.patch('/', verifyAuth_1.default, user_controllers_1.default.updateProfile);
exports.default = userRoutes;
