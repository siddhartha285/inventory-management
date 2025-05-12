"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'user' },
    seller: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Seller' },
    category: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'category' },
    name: { type: String, required: true },
    size: { type: String, enum: ['SMALL', 'MEDIUM', 'LARGE'] },
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'brand' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String }
}, { timestamps: true });
const Product = (0, mongoose_1.model)('product', productSchema);
exports.default = Product;
