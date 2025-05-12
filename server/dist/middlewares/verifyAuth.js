"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_1 = __importDefault(require("../errors/customError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const verifyAuth = (req, _res, next) => {
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        if (token) {
            try {
                const decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
                req.user = {
                    _id: decode === null || decode === void 0 ? void 0 : decode._id,
                    email: decode === null || decode === void 0 ? void 0 : decode.email
                };
                next();
            }
            catch (error) {
                throw new customError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorize! please login', 'Unauthorize');
            }
        }
        else {
            throw new customError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorize! please login', 'Unauthorize');
        }
    }
    else {
        throw new customError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorize! please login', 'Unauthorize');
    }
};
exports.default = verifyAuth;
