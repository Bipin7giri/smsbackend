"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
var typeorm_1 = require("typeorm");
var Semester_1 = require("./Semester");
var SoftDelete_1 = require("./SoftDelete");
var User_1 = require("./User");
var Department = /** @class */ (function (_super) {
    __extends(Department, _super);
    function Department() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Department.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Department.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)("text", { array: true }),
        __metadata("design:type", Array)
    ], Department.prototype, "teachers", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Semester_1.Semester; }, function (sem) { return sem.departmentId; }),
        __metadata("design:type", Array)
    ], Department.prototype, "semesterId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; }, function (user) { return user.hod; }),
        (0, typeorm_1.JoinColumn)({ name: 'hod_id' }),
        __metadata("design:type", User_1.User)
    ], Department.prototype, "hod", void 0);
    Department = __decorate([
        (0, typeorm_1.Entity)()
    ], Department);
    return Department;
}(SoftDelete_1.SoftDelete));
exports.Department = Department;
//# sourceMappingURL=Department.js.map