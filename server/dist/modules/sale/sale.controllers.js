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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const asyncHandler_1 = __importDefault(require("../../lib/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../lib/sendResponse"));
const sale_services_1 = __importDefault(require("./sale.services"));
class SaleControllers {
    constructor() {
        this.services = sale_services_1.default;
        /**
         * create new sale
         */
        this.create = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.create(req.body, req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.CREATED,
                message: 'sale created successfully!',
                data: result
            });
        }));
        /**
         * Get all sale of user with query
         */
        this.readAll = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield this.services.readAll(req.query, req.user._id);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'All sales retrieved successfully',
                meta: {
                    page,
                    limit,
                    total: ((_a = result === null || result === void 0 ? void 0 : result.totalCount[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                    totalPage: Math.ceil(((_b = result === null || result === void 0 ? void 0 : result.totalCount[0]) === null || _b === void 0 ? void 0 : _b.total) / limit)
                },
                data: result.data
            });
        }));
        /**
         * Get all sale by months
         */
        this.readAllMonths = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.readAllMonths(req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'monthly sales retrieved successfully',
                data: result
            });
        }));
        /**
         * Get all sale by daily
         */
        this.readAllDaily = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.readAllDaily(req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'daily sales retrieved successfully',
                data: result
            });
        }));
        /**
         * Get all sale by yearly
         */
        this.readAllYearly = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.readAllYearly(req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'yearly sales retrieved successfully',
                data: result
            });
        }));
        /**
         * Get all sale by week
         */
        this.readAllWeeks = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.readAllWeeks(req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'weekly sales retrieved successfully',
                data: result
            });
        }));
        /**
         * Get single sale of user
         */
        this.readSingle = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.services.read(req.params.id, req.user._id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'sale fetched successfully!',
                data: result
            });
        }));
        /**
         * update sale
         */
        this.update = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { price, quantity } = _a, restPayload = __rest(_a, ["price", "quantity"]);
            const sale = yield this.services.read(req.params.id, req.user._id);
            const updatedPrice = price || sale.product.price;
            const updatedQuantity = quantity || sale.quantity;
            restPayload.totalPrice = updatedPrice * updatedQuantity;
            restPayload.quantity = updatedQuantity;
            const result = yield this.services.update(req.params.id, restPayload);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'sale updated successfully!',
                data: result
            });
        }));
        /**
         * delete sale
         */
        this.delete = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.services.delete(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: 'sale delete successfully!'
            });
        }));
    }
}
const saleControllers = new SaleControllers();
exports.default = saleControllers;
