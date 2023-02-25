"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRole = exports.RoleSchema = void 0;
var Joi = require("joi");
exports.RoleSchema = Joi.object({
    name: Joi.string().required(),
    roles: Joi.array().required(),
});
exports.UpdateUserRole = Joi.object({
    userId: Joi.number().required(),
    roleId: Joi.number().required(),
});
//# sourceMappingURL=roleSchema.js.map