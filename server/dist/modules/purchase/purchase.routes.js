"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyAuth_1 = __importDefault(require("../../middlewares/verifyAuth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const purchase_controller_1 = __importDefault(require("./purchase.controller"));
const purchase_validator_1 = __importDefault(require("./purchase.validator"));
const purchaseRoutes = (0, express_1.Router)();
purchaseRoutes.use(verifyAuth_1.default);
purchaseRoutes.post('/', (0, validateRequest_1.default)(purchase_validator_1.default.createSchema), purchase_controller_1.default.create);
purchaseRoutes.get('/', purchase_controller_1.default.getAll);
purchaseRoutes.delete('/:id', purchase_controller_1.default.delete);
purchaseRoutes.patch('/:id', (0, validateRequest_1.default)(purchase_validator_1.default.updateSchema), purchase_controller_1.default.create);
exports.default = purchaseRoutes;
