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
exports.viewBlockUser = exports.unBlockUser = exports.blockUser = exports.updateUserRole = exports.countAllusers = exports.getAllUsers = exports.verifyEmail = exports.resetPassword = exports.forgetPassword = exports.updateUser = exports.getUser = exports.studentLogin = exports.login = exports.hodLogin = exports.accountantlogin = exports.adminlogin = exports.StudentRegister = exports.register = void 0;
var hashpassword_1 = require("../helper/hashpassword");
var jwt_1 = require("../helper/jwt");
var registerSchema_1 = require("../validationSchema/registerSchema");
var cloudinary = require("cloudinary");
var data_source_1 = require("../PGDB/data-source");
var User_1 = require("../entity/User");
var Role_1 = require("../entity/Role");
var generateRandomOTP_1 = require("../helper/generateRandomOTP");
var nodeMailer_1 = require("../helper/nodeMailer");
var typeorm_1 = require("typeorm");
var roleSchema_1 = require("../validationSchema/roleSchema");
var RoleEnum_1 = require("../ENUMS/RoleEnum");
var Repository_1 = require("../Repository");
var userModel = require("../MongoDB/Schema/UserSchema");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, hashedPassword, repo, roles_1, user, userRepo_1, saveUser, mailData, email, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    return [4 /*yield*/, (0, hashpassword_1.generateHashPassword)(validate === null || validate === void 0 ? void 0 : validate.password)];
                case 2:
                    hashedPassword = _a.sent();
                    repo = data_source_1.AppDataSource.getRepository(Role_1.Role);
                    return [4 /*yield*/, repo.findOne({
                            where: {
                                name: "student",
                            },
                        })];
                case 3:
                    roles_1 = _a.sent();
                    user = new User_1.User();
                    user.email = validate.email;
                    user.password = hashedPassword;
                    user.roleId = roles_1;
                    user.emailOtp = (0, generateRandomOTP_1.generateOTP)();
                    userRepo_1 = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, userRepo_1.save(user)];
                case 4:
                    saveUser = _a.sent();
                    mailData = {
                        to: user.email,
                        subject: "[SMS] Account Verification Request",
                        html: "<div>\n            <p>Hello,</p>\n            <p style=\"color: green;\">We have successfully registered your account with email address: ".concat(user.email, "</p>\n            <p>To verify your account please use provided OTP below</p>\n            <p>Your OTP for account verification opt is: ").concat(saveUser.emailOtp, "</p>\n            <p>If you didn\u2019t request to reset your password, please ignore this email or reset your password to protect your account.</p>\n      </div>"),
                        from: "giribipin04@gmail.com",
                        text: "Verifiication",
                    };
                    return [4 /*yield*/, nodeMailer_1.transporter.sendMail(mailData, function (err, info) {
                            if (err)
                                console.log(err);
                        })];
                case 5:
                    email = _a.sent();
                    if (saveUser) {
                        res.status(202).send({ message: "successfully registered" });
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    res.status(404).send({ error: true, message: err_1.message });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
function StudentRegister(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, hashedPassword, repo, roles_2, randomOTP, user, userRepo_2, saveUser, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    return [4 /*yield*/, (0, hashpassword_1.generateHashPassword)(validate === null || validate === void 0 ? void 0 : validate.password)];
                case 2:
                    hashedPassword = _a.sent();
                    repo = data_source_1.AppDataSource.getRepository(Role_1.Role);
                    return [4 /*yield*/, repo.findOne({
                            where: {
                                name: "student",
                            },
                        })];
                case 3:
                    roles_2 = _a.sent();
                    randomOTP = (0, generateRandomOTP_1.generateOTP)();
                    user = new User_1.User();
                    user.email = validate.email;
                    user.password = hashedPassword;
                    user.roleId = roles_2;
                    user.emailOtp = randomOTP;
                    userRepo_2 = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, userRepo_2.save(user)];
                case 4:
                    saveUser = _a.sent();
                    if (saveUser) {
                        res.status(202).send({ message: "successfully registered", status: 202 });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    throw err_2;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.StudentRegister = StudentRegister;
function adminlogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, user, checkPassword, accessToken, result, checkIfAlreadyExist, chatUser, err_3, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 14, , 15]);
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            relations: {
                                roleId: true,
                            },
                            where: {
                                email: validate.email,
                                blocked: false,
                                roleId: {
                                    name: RoleEnum_1.roles.ADMIN,
                                },
                            },
                        })];
                case 3:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, hashpassword_1.comparePassword)(user.password, validate.password)];
                case 4:
                    checkPassword = _a.sent();
                    if (!checkPassword) return [3 /*break*/, 10];
                    if ((user === null || user === void 0 ? void 0 : user.isEmailVerified) === false) {
                        res.json({
                            message: "Not verified Email please check our email for verification",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, jwt_1.generateToken)(user)];
                case 5:
                    accessToken = _a.sent();
                    return [4 /*yield*/, repo.update(user.id, {
                            deviceId: validate.deviceId,
                        })];
                case 6:
                    result = _a.sent();
                    return [4 /*yield*/, userModel.findOne({
                            username: user.email,
                        })];
                case 7:
                    checkIfAlreadyExist = _a.sent();
                    if (!validate.deviceId) return [3 /*break*/, 9];
                    if (!!checkIfAlreadyExist) return [3 /*break*/, 9];
                    return [4 /*yield*/, userModel.create({
                            username: user.email,
                            displayName: user.firstName,
                            deviceId: validate.deviceId,
                        })];
                case 8:
                    chatUser = _a.sent();
                    _a.label = 9;
                case 9:
                    res.json({
                        access_token: accessToken,
                        message: "Login successful !!",
                        status: 200,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    res.status(401).json({
                        message: "Invalid password !!",
                        status: 404,
                    });
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    res.status(401).json({
                        message: "No email found or Blocked",
                        status: 404,
                    });
                    _a.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    err_3 = _a.sent();
                    throw err_3;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_4 = _a.sent();
                    res.status(422).send({ error: true, message: err_4.message, status: 422 });
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.adminlogin = adminlogin;
function accountantlogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, user, checkPassword, accessToken, result, checkIfAlreadyExist, chatUser, err_5, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 14, , 15]);
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            relations: {
                                roleId: true,
                            },
                            where: {
                                email: validate.email,
                                blocked: false,
                                roleId: {
                                    name: RoleEnum_1.roles.ACCOUNTANT,
                                },
                            },
                        })];
                case 3:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, hashpassword_1.comparePassword)(user.password, validate.password)];
                case 4:
                    checkPassword = _a.sent();
                    if (!checkPassword) return [3 /*break*/, 10];
                    if ((user === null || user === void 0 ? void 0 : user.isEmailVerified) === false) {
                        res.json({
                            message: "Not verified Email please check our email for verification",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, jwt_1.generateToken)(user)];
                case 5:
                    accessToken = _a.sent();
                    return [4 /*yield*/, repo.update(user.id, {
                            deviceId: validate.deviceId,
                        })];
                case 6:
                    result = _a.sent();
                    return [4 /*yield*/, userModel.findOne({
                            username: user.email,
                        })];
                case 7:
                    checkIfAlreadyExist = _a.sent();
                    if (!validate.deviceId) return [3 /*break*/, 9];
                    if (!!checkIfAlreadyExist) return [3 /*break*/, 9];
                    return [4 /*yield*/, userModel.create({
                            username: user.email,
                            displayName: user.firstName,
                            deviceId: validate.deviceId,
                        })];
                case 8:
                    chatUser = _a.sent();
                    _a.label = 9;
                case 9:
                    res.json({
                        access_token: accessToken,
                        message: "Login successful !!",
                        status: 200,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    res.status(401).json({
                        message: "Invalid password !!",
                        status: 404,
                    });
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    res.status(401).json({
                        message: "No email found or Blocked",
                        status: 404,
                    });
                    _a.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    err_5 = _a.sent();
                    throw err_5;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_6 = _a.sent();
                    res.status(422).send({ error: true, message: err_6.message, status: 422 });
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.accountantlogin = accountantlogin;
function hodLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, user, checkPassword, accessToken, result, checkIfAlreadyExist, chatUser, err_7, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 14, , 15]);
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            relations: {
                                roleId: true,
                            },
                            where: {
                                email: validate.email,
                                blocked: false,
                                roleId: {
                                    name: RoleEnum_1.roles.HOD,
                                },
                            },
                        })];
                case 3:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, hashpassword_1.comparePassword)(user.password, validate.password)];
                case 4:
                    checkPassword = _a.sent();
                    if (!checkPassword) return [3 /*break*/, 10];
                    if ((user === null || user === void 0 ? void 0 : user.isEmailVerified) === false) {
                        res.json({
                            message: "Not verified Email please check our email for verification",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, jwt_1.generateToken)(user)];
                case 5:
                    accessToken = _a.sent();
                    return [4 /*yield*/, repo.update(user.id, {
                            deviceId: validate.deviceId,
                        })];
                case 6:
                    result = _a.sent();
                    return [4 /*yield*/, userModel.findOne({
                            username: user.email,
                        })];
                case 7:
                    checkIfAlreadyExist = _a.sent();
                    if (!validate.deviceId) return [3 /*break*/, 9];
                    if (!!checkIfAlreadyExist) return [3 /*break*/, 9];
                    return [4 /*yield*/, userModel.create({
                            username: user.email,
                            displayName: user.firstName,
                            deviceId: validate.deviceId,
                        })];
                case 8:
                    chatUser = _a.sent();
                    _a.label = 9;
                case 9:
                    res.json({
                        access_token: accessToken,
                        message: "Login successful !!",
                        status: 200,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    res.status(401).json({
                        message: "Invalid password !!",
                        status: 404,
                    });
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    res.status(401).json({
                        message: "No email found or Blocked",
                        status: 404,
                    });
                    _a.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    err_7 = _a.sent();
                    throw err_7;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_8 = _a.sent();
                    res.status(422).send({ error: true, message: err_8.message, status: 422 });
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.hodLogin = hodLogin;
function login(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, user, checkPassword, accessToken, result, checkIfAlreadyExist, chatUser, err_9, err_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 14, , 15]);
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            relations: {
                                roleId: true,
                            },
                            where: {
                                email: validate.email,
                                blocked: false,
                            },
                        })];
                case 3:
                    user = _b.sent();
                    if (!user) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, hashpassword_1.comparePassword)(user.password, validate.password)];
                case 4:
                    checkPassword = _b.sent();
                    if (!checkPassword) return [3 /*break*/, 10];
                    if ((user === null || user === void 0 ? void 0 : user.isEmailVerified) === false) {
                        res.json({
                            message: "Not verified Email please check our email for verification",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, jwt_1.generateToken)(user)];
                case 5:
                    accessToken = _b.sent();
                    return [4 /*yield*/, repo.update(user.id, {
                            deviceId: validate.deviceId,
                        })];
                case 6:
                    result = _b.sent();
                    return [4 /*yield*/, userModel.findOne({
                            username: user.email,
                        })];
                case 7:
                    checkIfAlreadyExist = _b.sent();
                    if (!validate.deviceId) return [3 /*break*/, 9];
                    if (!!checkIfAlreadyExist) return [3 /*break*/, 9];
                    return [4 /*yield*/, userModel.create({
                            username: user.email,
                            displayName: user.firstName,
                            deviceId: validate.deviceId,
                        })];
                case 8:
                    chatUser = _b.sent();
                    _b.label = 9;
                case 9:
                    res.json({
                        access_token: accessToken,
                        message: "Login successful !!",
                        role: (_a = user.roleId) === null || _a === void 0 ? void 0 : _a.name,
                        status: 200,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    res.status(401).json({
                        message: "Invalid password !!",
                        status: 404,
                    });
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    res.status(401).json({
                        message: "No email found or Blocked",
                        status: 404,
                    });
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    err_9 = _b.sent();
                    throw err_9;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_10 = _b.sent();
                    res.status(422).send({ error: true, message: err_10.message, status: 422 });
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
function studentLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, user, checkPassword, accessToken, result, checkIfAlreadyExist, chatUser, err_11, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 14, , 15]);
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            relations: {
                                roleId: true,
                            },
                            where: {
                                email: validate.email,
                                blocked: false,
                                roleId: {
                                    name: RoleEnum_1.roles.STUDENT,
                                },
                            },
                        })];
                case 3:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, hashpassword_1.comparePassword)(user.password, validate.password)];
                case 4:
                    checkPassword = _a.sent();
                    if (!checkPassword) return [3 /*break*/, 10];
                    if ((user === null || user === void 0 ? void 0 : user.isEmailVerified) === false) {
                        res.json({
                            message: "Not verified Email please check our email for verification",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, jwt_1.generateToken)(user)];
                case 5:
                    accessToken = _a.sent();
                    return [4 /*yield*/, repo.update(user.id, {
                            deviceId: validate.deviceId,
                        })];
                case 6:
                    result = _a.sent();
                    return [4 /*yield*/, userModel.findOne({
                            username: user.email,
                        })];
                case 7:
                    checkIfAlreadyExist = _a.sent();
                    if (!validate.deviceId) return [3 /*break*/, 9];
                    if (!!checkIfAlreadyExist) return [3 /*break*/, 9];
                    return [4 /*yield*/, userModel.create({
                            username: user.email,
                            displayName: user.firstName,
                            deviceId: validate.deviceId,
                        })];
                case 8:
                    chatUser = _a.sent();
                    _a.label = 9;
                case 9:
                    res.json({
                        access_token: accessToken,
                        message: "Login successful !!",
                        status: 200,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    res.status(401).json({
                        message: "Invalid password !!",
                        status: 404,
                    });
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    res.status(401).json({
                        message: "No email found or Blocked",
                        status: 404,
                    });
                    _a.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    err_11 = _a.sent();
                    throw err_11;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_12 = _a.sent();
                    res.status(422).send({ error: true, message: err_12.message, status: 422 });
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.studentLogin = studentLogin;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var currentUser, repo, user, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    currentUser = req.user;
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOneOrFail({
                            where: {
                                id: currentUser.id,
                            },
                            relations: [
                                "roleId",
                                "classes.subjectId.semesterId",
                                "classes.subjectId.semesterId.departmentId",
                            ],
                        })];
                case 1:
                    user = _a.sent();
                    // user?.password = null;
                    if (user) {
                        res.json(user);
                    }
                    else {
                        res.status(404).send("No use found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_13 = _a.sent();
                    res.status(404).send({ error: true, message: err_13.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
function updateUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var validate, currentUser, repo, imageUrl, user, err_14;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, registerSchema_1.UserUpdateSchema.validateAsync(req.body)];
                case 1:
                    validate = _b.sent();
                    currentUser = req.user;
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    if (!(req === null || req === void 0 ? void 0 : req.file)) return [3 /*break*/, 3];
                    return [4 /*yield*/, cloudinary.uploader.upload((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path)];
                case 2:
                    imageUrl = _b.sent();
                    validate.avatar = imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.secure_url;
                    _b.label = 3;
                case 3: return [4 /*yield*/, repo.update(currentUser.id, validate)];
                case 4:
                    user = _b.sent();
                    if (user) {
                        res.json("user successfully updated");
                    }
                    else {
                        res.status(404).send("No use found");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_14 = _b.sent();
                    res.status(404).send({ error: true, message: err_14.message });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.updateUser = updateUser;
function forgetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, randomOTP, user, mailData, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, registerSchema_1.ForgetPassword.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    randomOTP = (0, generateRandomOTP_1.generateOTP)();
                    return [4 /*yield*/, repo.update({ email: validate.email }, {
                            forgetPassword: randomOTP,
                        })];
                case 2:
                    user = _a.sent();
                    mailData = {
                        from: "giribipin04@gmail.com",
                        to: validate.email,
                        subject: "FROM SMS ",
                        text: "That was easy!",
                        html: "<b>Hey there! </b>   <b>We received a request to reset the password for your account with email address: bipingiri27@gmail.com </b>    <b>To reset your account please use provided OTP below.</b> <b> </b>          <br>  Your OTP for reset password OTP is: ".concat(randomOTP, "<br/>"),
                    };
                    nodeMailer_1.transporter.sendMail(mailData, function (err, info) {
                        if (err)
                            console.log(err);
                        else
                            res.status(200).json({
                                message: "check your email",
                                status: 200,
                            });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_15 = _a.sent();
                    res.status(404).send({ error: true, message: err_15.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.forgetPassword = forgetPassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var validate_1, repo_1, hashPassword, verifyOTP, err_16;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, registerSchema_1.ResetPassword.validateAsync(req.body)];
                case 1:
                    validate_1 = _a.sent();
                    repo_1 = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, (0, hashpassword_1.generateHashPassword)(validate_1.password)];
                case 2:
                    hashPassword = _a.sent();
                    return [4 /*yield*/, repo_1.findOne({
                            where: {
                                forgetPassword: validate_1.otp,
                            },
                        })];
                case 3:
                    verifyOTP = _a.sent();
                    if (!verifyOTP) return [3 /*break*/, 5];
                    return [4 /*yield*/, repo_1
                            .update({ forgetPassword: validate_1.otp }, {
                            password: hashPassword,
                        })
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, repo_1.update({
                                            forgetPassword: validate_1.otp,
                                        }, {
                                            forgetPassword: "",
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _a.sent();
                    res.status(202).json({
                        message: "Successfully Reset password",
                    });
                    return [3 /*break*/, 6];
                case 5:
                    res.status(401).json({
                        message: "invalid opt",
                    });
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_16 = _a.sent();
                    res.status(404).send({ error: true, message: err_16.message });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.resetPassword = resetPassword;
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, verifyOTP, err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, registerSchema_1.VerifyOTP.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            where: {
                                emailOtp: validate.otp,
                            },
                        })];
                case 2:
                    verifyOTP = _a.sent();
                    if (!verifyOTP) return [3 /*break*/, 4];
                    return [4 /*yield*/, repo.update({ emailOtp: validate.otp }, {
                            isEmailVerified: true,
                        })];
                case 3:
                    _a.sent();
                    res.status(202).json({
                        message: "Successfully verified",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    res.status(401).json({
                        message: "invalid opt",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_17 = _a.sent();
                    res.status(404).send({ error: true, message: err_17.message });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.verifyEmail = verifyEmail;
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalUser, skip, take, searchData, repo, searchQuery, users, users, err_18;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                return [4 /*yield*/, countAllusers()];
            case 1:
                totalUser = _d.sent();
                skip = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.skip) || 0;
                take = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.take) || totalUser + 1;
                searchData = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.search) || null;
                repo = data_source_1.AppDataSource.getRepository(User_1.User);
                searchQuery = "%".concat(searchData, "%");
                if (!(searchData === "null" ||
                    searchData === null ||
                    searchData === undefined ||
                    searchData === "undefined")) return [3 /*break*/, 3];
                return [4 /*yield*/, repo.find({
                        relations: ["roleId", "hod"],
                        order: {
                            updatedAt: "DESC",
                        },
                        skip: parseInt(skip),
                        take: parseInt(take),
                    })];
            case 2:
                users = _d.sent();
                res.json(users);
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, repo.find({
                    relations: ["roleId", "hod"],
                    where: {
                        email: (0, typeorm_1.Like)(searchQuery),
                    },
                    order: {
                        updatedAt: "DESC",
                    },
                    skip: parseInt(skip),
                    take: parseInt(take),
                })];
            case 4:
                users = _d.sent();
                res.json(users);
                _d.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_18 = _d.sent();
                res.json(err_18);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
function countAllusers() {
    return __awaiter(this, void 0, void 0, function () {
        var repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.count({
                            where: {
                                deleted: false,
                            },
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.countAllusers = countAllusers;
var updateUserRole = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validate, result, err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, roleSchema_1.UpdateUserRole.validateAsync(req.body)];
            case 1:
                validate = _a.sent();
                return [4 /*yield*/, Repository_1.userRepo.update(validate.userId, {
                        roleId: validate.roleId,
                    })];
            case 2:
                result = _a.sent();
                res.json({
                    status: 202,
                    message: "Successfully updated role",
                });
                return [3 /*break*/, 4];
            case 3:
                err_19 = _a.sent();
                res.json({ error: err_19 === null || err_19 === void 0 ? void 0 : err_19.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateUserRole = updateUserRole;
var blockUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validate, result, err_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, registerSchema_1.BlockUser.validateAsync(req.body)];
            case 1:
                validate = _a.sent();
                return [4 /*yield*/, Repository_1.userRepo.update(validate.userId, {
                        blocked: true,
                    })];
            case 2:
                result = _a.sent();
                res.json({
                    status: 202,
                    message: "Successfully blocked users",
                });
                return [3 /*break*/, 4];
            case 3:
                err_20 = _a.sent();
                res.json({ error: err_20 === null || err_20 === void 0 ? void 0 : err_20.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.blockUser = blockUser;
var unBlockUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validate, result, err_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, registerSchema_1.BlockUser.validateAsync(req.body)];
            case 1:
                validate = _a.sent();
                return [4 /*yield*/, Repository_1.userRepo.update(validate.userId, {
                        blocked: false,
                    })];
            case 2:
                result = _a.sent();
                res.json({
                    status: 202,
                    message: "Successfully blocked users",
                });
                return [3 /*break*/, 4];
            case 3:
                err_21 = _a.sent();
                res.json({ error: err_21 === null || err_21 === void 0 ? void 0 : err_21.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.unBlockUser = unBlockUser;
var viewBlockUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Repository_1.userRepo.find({
                        where: {
                            blocked: true,
                        },
                    })];
            case 1:
                result = _a.sent();
                res.json({
                    result: result,
                });
                return [3 /*break*/, 3];
            case 2:
                err_22 = _a.sent();
                res.json({ error: err_22 === null || err_22 === void 0 ? void 0 : err_22.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.viewBlockUser = viewBlockUser;
//# sourceMappingURL=auth.controller.js.map