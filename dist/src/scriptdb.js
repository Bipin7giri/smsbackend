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
exports.connectDb = void 0;
var data_source_1 = require("./DB/data-source");
var Role_1 = require("./entity/Role");
var User_1 = require("./entity/User");
var connectDb = function () {
    data_source_1.AppDataSource.initialize().then(function () { return __awaiter(void 0, void 0, void 0, function () {
        var repo, countIfuser, admin, student, teacher, accountant, roles, user, adminCreated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repo = data_source_1.AppDataSource.getRepository(User_1.User);
                    return [4 /*yield*/, repo.count()];
                case 1:
                    countIfuser = _a.sent();
                    console.log(countIfuser);
                    if (!(countIfuser === 0)) return [3 /*break*/, 7];
                    admin = new Role_1.Role();
                    student = new Role_1.Role();
                    teacher = new Role_1.Role();
                    accountant = new Role_1.Role();
                    admin.name = 'admin';
                    admin.roles = ['admin', 'teacher', 'accountant', 'student'];
                    student.name = 'student';
                    student.roles = ['student'];
                    teacher.name = 'teacher';
                    teacher.roles = ['teacher'];
                    accountant.name = 'accountant';
                    accountant.roles = ['accountant'];
                    return [4 /*yield*/, data_source_1.AppDataSource.manager.save(admin)];
                case 2:
                    roles = _a.sent();
                    return [4 /*yield*/, data_source_1.AppDataSource.manager.save(student)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, data_source_1.AppDataSource.manager.save(teacher)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, data_source_1.AppDataSource.manager.save(accountant)];
                case 5:
                    _a.sent();
                    user = new User_1.User();
                    user.firstName = "admin";
                    user.lastName = "admin";
                    user.email = 'admin@example.com';
                    user.password = '$2a$12$DzW7DBrHUTYFRie7ycF8ouIubkmsrKzNcZs2bZ6mtWpY4FDYoTwhm';
                    user.roleId = roles;
                    return [4 /*yield*/, data_source_1.AppDataSource.manager.save(user)];
                case 6:
                    adminCreated = _a.sent();
                    console.log(adminCreated);
                    _a.label = 7;
                case 7:
                    // // console.log("Inserting a new user into the database...")
                    // // const user = new User()
                    // // user.firstName = "Timber"
                    // // user.lastName = "Saw"
                    // // user.age = 25
                    // // await AppDataSource.manager.save(user)
                    // // console.log("Saved a new user with id: " + user.id)
                    // console.log("Loading users from the database...")
                    // const users = await AppDataSource.manager.find(User)
                    // console.log("Loaded users: ", users)
                    console.log("connected to db");
                    return [2 /*return*/];
            }
        });
    }); }).catch(function (error) { return console.log(error); });
};
exports.connectDb = connectDb;
//# sourceMappingURL=scriptdb.js.map