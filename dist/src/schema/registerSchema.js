"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
// const Joi = require('joi');
var Joi = require("joi");
exports.RegisterSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
});
//# sourceMappingURL=registerSchema.js.map