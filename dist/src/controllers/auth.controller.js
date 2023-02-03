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
exports.getUser = exports.login = exports.register = void 0;
var hashpassword_1 = require("../helper/hashpassword");
var jwt_1 = require("../helper/jwt");
var registerSchema_1 = require("../schema/registerSchema");
// import { UserPatchSchema } from "../schema/userschema/userpatch.schema";
var cloudinary = require("cloudinary");
var data_source_1 = require("../DB/data-source");
var User_1 = require("../entity/User");
var Role_1 = require("../entity/Role");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, hashedPassword, repo, roles, user, userRepo, saveUser, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, (0, hashpassword_1.generateHashPassword)(validate === null || validate === void 0 ? void 0 : validate.password)];
                case 3:
                    hashedPassword = _a.sent();
                    repo = data_source_1.AppDataSource.getRepository(Role_1.Role);
                    return [4 /*yield*/, repo.findOne({ where: {
                                id: 2,
                            } })];
                case 4:
                    roles = _a.sent();
                    user = new User_1.User();
                    user.email = validate.email;
                    user.password = hashedPassword;
                    user.roleId = roles;
                    userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, userRepo.save(user)];
                case 5:
                    saveUser = _a.sent();
                    res.status(202).send({ message: "successfully registred" });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    res.status(404).send({ error: true, message: err_1.message });
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    res.status(404).send({ error: true, message: err_2 });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var validate, repo, user, checkPassword, accessToken, err_3, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, registerSchema_1.RegisterSchema.validateAsync(req.body)];
                case 1:
                    validate = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, , 11]);
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOne({
                            relations: {
                                roleId: true
                            },
                            where: {
                                email: validate.email
                            }
                        })];
                case 3:
                    user = _a.sent();
                    console.table(user);
                    if (!user) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, hashpassword_1.comparePassword)(user.password, validate.password)];
                case 4:
                    checkPassword = _a.sent();
                    if (!(checkPassword === true)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, jwt_1.genterateToken)(user)];
                case 5:
                    accessToken = _a.sent();
                    res.status(200).json({
                        access_token: accessToken,
                        message: "Login sucessfull !!",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    res.status(404).json({
                        message: "Invalid password !!",
                    });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    res.status(404).json({
                        message: "No email found",
                    });
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_3 = _a.sent();
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_4 = _a.sent();
                    res.status(422).send({ error: true, message: err_4.message });
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
// export async function update(req: any, res: Response):Promise<void> {
//   try {
//     const token = req?.headers["authorization"]?.split(" ")[1];
//     const currentUser = getCurrentUser(token || "");
//     const validate = await UserPatchSchema.validateAsync(req.body);
//     if (req?.file) {
//       const imageUrl = await cloudinary.uploader.upload(req?.file?.path);
//       const user = await prisma.user.update({
//         where: {
//           id: currentUser?.id,
//         },
//         data: {
//           name: validate.name,
//           phone_Int: validate.phoneNumber,
//           address: validate.address,
//           avatar: imageUrl?.secure_url,
//         },
//       });
//       res.json(user);
//     } else {
//       const user = await prisma.user.update({
//         where: {
//           id: currentUser?.id,
//         },
//         data: validate,
//       });
//       res.json(user);
//     }
//     if (!currentUser) throw new Error("Something went worng!!");
//   } catch (err: any) {
//     res.status(422).send({ error: true, message: err.message });;
//   }
// }
function getUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, currentUser, repo, user, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    token = ((_a = req === null || req === void 0 ? void 0 : req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
                    currentUser = (0, jwt_1.getCurrentUser)(token || "");
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.findOneOrFail({ where: {
                                id: currentUser.id
                            } })];
                case 1:
                    user = _b.sent();
                    // user?.password = null;
                    if (user) {
                        res.json(user);
                    }
                    else {
                        res.status(404).send("No use found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _b.sent();
                    res.status(404).send({ error: true, message: err_5.message });
                    ;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
// export async function countAllusers():Promise<number> {
//   return await prisma.user.count({where:{
//     deleted:false
//   }})
// }
// export async function getAllUsers(req:Request,res:Response):Promise<void> {
//   try{
//     const totalUser =  await countAllusers();
//     const skip:any = req.query?.skip||0
//     const take:any = req.query?.take||totalUser+1
//     console.log(totalUser)
//     const data = await prisma.user.findMany({
//       skip:  parseInt(skip),
//       take: parseInt(take),
//     });
//     res.status(200).json(data)
//   }catch(err:any){
//     res.json(err.message)
//   }
// }
//# sourceMappingURL=auth.controller.js.map