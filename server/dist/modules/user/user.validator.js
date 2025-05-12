"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, { message: 'password must have 6 characters' })
});
const updatedProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional()
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, { message: 'password must have 6 characters' })
});
const changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z
        .string({ required_error: 'Old Password is required!' })
        .min(6, { message: 'old password must have 6 characters' }),
    newPassword: zod_1.z
        .string({ required_error: 'New Password is required!' })
        .min(6, { message: 'new password must have 6 characters' })
});
const userValidator = { registerSchema, loginSchema, updatedProfileSchema, changePasswordSchema };
exports.default = userValidator;
