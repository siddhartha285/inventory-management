"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
/* eslint-disable no-unsafe-finally */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
const sortAndPaginate_pipeline_1 = __importDefault(require("../../lib/sortAndPaginate.pipeline"));
const baseServices_1 = __importDefault(require("../baseServices"));
const sale_model_1 = __importDefault(require("./sale.model"));
const product_model_1 = __importDefault(require("../product/product.model"));
const customError_1 = __importDefault(require("../../errors/customError"));
class SaleServices extends baseServices_1.default {
    constructor(model, modelName) {
        super(model, modelName);
    }
    /**
     * Create new sale and decrease product stock
     */
    create(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productPrice, quantity } = payload;
            payload.user = userId;
            payload.totalPrice = productPrice * quantity;
            const product = yield product_model_1.default.findById(payload.product);
            if (quantity > product.stock) {
                throw new customError_1.default(400, `${quantity} product are not available in stock!`);
            }
            let result;
            const session = yield mongoose_1.default.startSession();
            try {
                session.startTransaction();
                yield product_model_1.default.findByIdAndUpdate(product === null || product === void 0 ? void 0 : product._id, { $inc: { stock: -quantity } }, { session });
                result = yield this.model.create([payload], { session });
                yield session.commitTransaction();
                return result;
            }
            catch (error) {
                yield session.abortTransaction();
                throw new customError_1.default(400, 'Sale create failed');
            }
            finally {
                yield session.endSession();
            }
        });
    }
    /**
     *  Get all sale
     */
    readAll() {
        return __awaiter(this, arguments, void 0, function* (query = {}, userId) {
            // const date = query.date ? query.date : null;
            const search = query.search ? query.search : '';
            const data = yield this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId),
                        $or: [{ productName: { $regex: search, $options: 'i' } }, { buyerName: { $regex: search, $options: 'i' } }]
                    }
                },
                ...(0, sortAndPaginate_pipeline_1.default)(query)
            ]);
            const totalCount = yield this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]);
            return { data, totalCount };
        });
    }
    readAllWeeks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId),
                        date: { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: {
                            week: { $isoWeek: '$date' },
                            year: { $isoWeekYear: '$date' }
                        },
                        totalQuantity: { $sum: '$quantity' },
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.week': 1
                    }
                },
                {
                    $project: {
                        week: '$_id.week',
                        year: '$_id.year',
                        totalQuantity: 1,
                        totalRevenue: 1,
                        _id: 0
                    }
                }
            ]);
        });
    }
    readAllYearly(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId),
                        date: { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' }
                        },
                        totalQuantity: { $sum: '$quantity' },
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                },
                {
                    $sort: {
                        '_id.year': 1
                    }
                },
                {
                    $project: {
                        year: '$_id.year',
                        totalQuantity: 1,
                        totalRevenue: 1,
                        _id: 0
                    }
                }
            ]);
        });
    }
    readAllDaily(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId),
                        date: { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: '$date' },
                            month: { $month: '$date' },
                            year: { $year: '$date' }
                        },
                        totalQuantity: { $sum: '$quantity' },
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.month': 1,
                        '_id.day': 1
                    }
                },
                {
                    $project: {
                        day: '$_id.day',
                        month: '$_id.month',
                        year: '$_id.year',
                        totalQuantity: 1,
                        totalRevenue: 1,
                        _id: 0
                    }
                }
            ]);
        });
    }
    readAllMonths(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId),
                        date: { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$date' },
                            year: { $year: '$date' }
                        },
                        totalQuantity: { $sum: '$quantity' },
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.month': 1
                    }
                },
                {
                    $project: {
                        month: '$_id.month',
                        year: '$_id.year',
                        totalQuantity: 1,
                        totalRevenue: 1,
                        _id: 0
                    }
                }
            ]);
        });
    }
    // get single sale
    read(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._isExists(id);
            return this.model.findOne({ user: new mongoose_1.Types.ObjectId(userId), _id: id }).populate({
                path: 'product',
                select: '-createdAt -updatedAt -__v'
            });
        });
    }
}
const saleServices = new SaleServices(sale_model_1.default, 'modelName');
exports.default = saleServices;
