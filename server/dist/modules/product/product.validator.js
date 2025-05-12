"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createSchema = zod_1.z.object({
    name: zod_1.z.string(),
    seller: zod_1.z.string(),
    size: zod_1.z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    category: zod_1.z.string(),
    brand: zod_1.z.string().optional(),
    price: zod_1.z.number().min(1, { message: 'Must be grater than 1!' }),
    stock: zod_1.z.number().min(1, { message: 'Must be grater than 1!' })
});
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    seller: zod_1.z.string().optional(),
    size: zod_1.z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    category: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    price: zod_1.z.number().min(1, { message: 'Must be grater than 1!' }).optional(),
    stock: zod_1.z.number().min(1, { message: 'Must be grater than 1!' }).optional()
});
const addStockSchema = zod_1.z.object({
    stock: zod_1.z.number().min(1, { message: 'Must be grater than 1!' })
});
const productValidator = { createSchema, updateSchema, addStockSchema };
exports.default = productValidator;
