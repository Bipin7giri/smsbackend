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
        while (_) try {
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
exports.HODAuthorization = exports.TeacherAuthorization = exports.StudentAuthorization = exports.AdminAuthorization = exports.getCurrentUser = exports.tokenValidation = exports.genterateToken = void 0;
var jwt = require("jsonwebtoken");
function genterateToken(user, expire) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log(user);
                    return [4 /*yield*/, jwt.sign({
                            // email: user.email,
                            id: user.id,
                            roles: user.roleId.roles,
                            email: user.email
                        }, "json_web_token_pw", {
                            expiresIn: "10h",
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.genterateToken = genterateToken;
function tokenValidation(req, res, next) {
    var _a;
    var authHeader = req.headers["authorization"];
    var token = (_a = req === null || req === void 0 ? void 0 : req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!authHeader) {
        return res.status(404).json({
            message: "No access_token found",
        });
    }
    jwt.verify(token, "json_web_token_pw", function (err, user) {
        try {
            if (err)
                return res.status(401).json({
                    message: "unauthorized access",
                });
            next();
        }
        catch (err) {
            res.send(err);
        }
    });
}
exports.tokenValidation = tokenValidation;
function getCurrentUser(token) {
    // function parseJwt (token) {
    var user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return user;
    // }
}
exports.getCurrentUser = getCurrentUser;
function AdminAuthorization(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, user, index;
        return __generator(this, function (_b) {
            token = (_a = req === null || req === void 0 ? void 0 : req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            for (index = 0; index < user.roles.length; index++) {
                if (user.roles[index] === 'admin') {
                    next();
                    return [2 /*return*/];
                }
                else {
                    res.status(401).json({
                        message: "unauthorized access you are not admin!! sorry baby",
                    });
                    return [2 /*return*/];
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.AdminAuthorization = AdminAuthorization;
function StudentAuthorization(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, user, index;
        return __generator(this, function (_b) {
            token = (_a = req === null || req === void 0 ? void 0 : req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            for (index = 0; index < user.roles.length; index++) {
                if (user.roles[index] === 'student') {
                    next();
                    return [2 /*return*/];
                }
                else {
                    res.status(401).json({
                        message: "unauthorized access you are not student!! sorry baby",
                    });
                    return [2 /*return*/];
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.StudentAuthorization = StudentAuthorization;
function TeacherAuthorization(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, user, counter, index;
        return __generator(this, function (_b) {
            token = (_a = req === null || req === void 0 ? void 0 : req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            counter = 0;
            for (index = 0; index < user.roles.length; index++) {
                counter = counter + 1;
                if (user.roles[index] === 'teacher') {
                    next();
                    return [2 /*return*/];
                }
            }
            if (counter === user.roles.length) {
                res.status(401).json({
                    message: "unauthorized access you are not Teacher!! sorry baby",
                });
            }
            return [2 /*return*/];
        });
    });
}
exports.TeacherAuthorization = TeacherAuthorization;
function HODAuthorization(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, user, counter, index;
        return __generator(this, function (_b) {
            token = (_a = req === null || req === void 0 ? void 0 : req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            counter = 0;
            for (index = 0; index < user.roles.length; index++) {
                counter = counter + 1;
                if (user.roles[index] === 'hod') {
                    next();
                    return [2 /*return*/];
                }
            }
            if (counter === user.roles.length) {
                res.status(401).json({
                    message: "unauthorized access you are not HOD!! sorry baby",
                });
            }
            return [2 /*return*/];
        });
    });
}
exports.HODAuthorization = HODAuthorization;
//# sourceMappingURL=jwt.js.map