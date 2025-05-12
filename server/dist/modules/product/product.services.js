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
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
const sortAndPaginate_pipeline_1 = __importDefault(require("../../lib/sortAndPaginate.pipeline"));
const baseServices_1 = __importDefault(require("../baseServices"));
const product_model_1 = __importDefault(require("./product.model"));
const product_aggregation_pipeline_1 = __importDefault(require("./product.aggregation.pipeline"));
const customError_1 = __importDefault(require("../../errors/customError"));
const purchase_model_1 = __importDefault(require("../purchase/purchase.model"));
const seller_model_1 = __importDefault(require("../seller/seller.model"));
class ProductServices extends baseServices_1.default {
    constructor(model, modelName) {
        super(model, modelName);
    }
    /**
     * Create new product
     */
    create(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            Object.keys(payload).forEach((key) => {
                if (payload[key] === '') {
                    delete payload[key];
                }
            });
            payload.user = new mongoose_1.Types.ObjectId(userId);
            const session = yield mongoose_1.default.startSession();
            try {
                session.startTransaction();
                const seller = yield seller_model_1.default.findById(payload.seller);
                const product = yield this.model.create([payload], { session });
                yield purchase_model_1.default.create([
                    {
                        user: userId,
                        seller: (_a = product[0]) === null || _a === void 0 ? void 0 : _a.seller,
                        product: (_b = product[0]) === null || _b === void 0 ? void 0 : _b._id,
                        sellerName: seller === null || seller === void 0 ? void 0 : seller.name,
                        productName: (_c = product[0]) === null || _c === void 0 ? void 0 : _c.name,
                        quantity: (_d = product[0]) === null || _d === void 0 ? void 0 : _d.stock,
                        unitPrice: (_e = product[0]) === null || _e === void 0 ? void 0 : _e.price,
                        totalPrice: ((_f = product[0]) === null || _f === void 0 ? void 0 : _f.stock) * ((_g = product[0]) === null || _g === void 0 ? void 0 : _g.price)
                    }
                ], { session });
                yield session.commitTransaction();
                return product;
            }
            catch (error) {
                console.log(error);
                yield session.abortTransaction();
                throw new customError_1.default(400, 'Product create failed');
            }
            finally {
                yield session.endSession();
            }
        });
    }
    /**
     * Count Total Product
     */
    countTotalProduct(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.aggregate([
                {
                    $match: {
                        user: new mongoose_1.Types.ObjectId(userId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalQuantity: { $sum: '$stock' }
                    }
                },
                {
                    $project: {
                        totalQuantity: 1,
                        _id: 0
                    }
                }
            ]);
        });
    }
    /**
     * Get All product of user
     */
    readAll() {
        return __awaiter(this, arguments, void 0, function* (query = {}, userId) {
            let data = yield this.model.aggregate([...(0, product_aggregation_pipeline_1.default)(query, userId), ...(0, sortAndPaginate_pipeline_1.default)(query)]);
            const totalCount = yield this.model.aggregate([
                ...(0, product_aggregation_pipeline_1.default)(query, userId),
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
            data = yield this.model.populate(data, { path: 'category', select: '-__v -user' });
            data = yield this.model.populate(data, { path: 'brand', select: '-__v -user' });
            data = yield this.model.populate(data, { path: 'seller', select: '-__v -user -createdAt -updatedAt' });
            return { data, totalCount };
        });
    }
    /**
     * Get Single product of user
     */
    read(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._isExists(id);
            return this.model.findOne({ user: new mongoose_1.Types.ObjectId(userId), _id: id });
        });
    }
    /**
     * Multiple delete
     */
    bulkDelete(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = payload.map((item) => new mongoose_1.Types.ObjectId(item));
            return this.model.deleteMany({ _id: { $in: data } });
        });
    }
    /**
     * Create new product
     */
    addToStock(id, payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                session.startTransaction();
                const seller = yield seller_model_1.default.findById(payload.seller);
                const product = yield this.model.findByIdAndUpdate(id, { $inc: { stock: payload.stock } }, { session });
                yield purchase_model_1.default.create([
                    {
                        user: userId,
                        seller: product.seller,
                        product: product._id,
                        sellerName: seller === null || seller === void 0 ? void 0 : seller.name,
                        productName: product.name,
                        quantity: Number(product.stock),
                        unitPrice: Number(product.price),
                        totalPrice: Number(product.stock) * Number(product.price)
                    }
                ], { session });
                yield session.commitTransaction();
                return product;
            }
            catch (error) {
                console.log(error);
                yield session.abortTransaction();
                throw new customError_1.default(400, 'Product create failed');
            }
            finally {
                yield session.endSession();
            }
        });
    }
}
const productServices = new ProductServices(product_model_1.default, 'Product');
exports.default = productServices;
