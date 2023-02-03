"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSchema = void 0;
var Joi = require("joi");
exports.RoleSchema = Joi.object({
    name: Joi.string().required(),
    roles: Joi.array().required(),
});
//# sourceMappingURL=roleSchema.js.map