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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.remove = exports.create = void 0;
var data_source_1 = require("../PGDB/data-source");
var Role_1 = require("../entity/Role");
var roleSchema_1 = require("../validationSchema/roleSchema");
var Repository_1 = require("../Repository");
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validate, role, repo_1, saveRole, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, roleSchema_1.RoleSchema.validateAsync(req.body)];
            case 1:
                validate = _a.sent();
                role = new Role_1.Role();
                repo_1 = data_source_1.AppDataSource.getRepository(Role_1.Role);
                role.name = validate.name;
                role.roles = validate.roles;
                return [4 /*yield*/, repo_1.save(role)];
            case 2:
                saveRole = _a.sent();
                if (saveRole) {
                    res.status(202).json({ saveRole: saveRole });
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(422).json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var remove = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roleId, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                roleId = req.params.roleId;
                return [4 /*yield*/, Repository_1.repo.update(+roleId, {
                        deleted: true,
                        deletedAt: new Date(),
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.json(err_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.remove = remove;
var get = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repo_2, allRole, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                repo_2 = data_source_1.AppDataSource.getRepository(Role_1.Role);
                return [4 /*yield*/, repo_2.find()];
            case 1:
                allRole = _a.sent();
                if (allRole) {
                    res.status(202).json({ allRole: allRole });
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(422).json(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get = get;
//# sourceMappingURL=role.controller.js.map