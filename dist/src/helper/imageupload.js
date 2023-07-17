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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
var cloudinary = require("cloudinary");
var dotenv = require("dotenv");
dotenv.config();
var APIKey = (_a = process.env) === null || _a === void 0 ? void 0 : _a.APIKey;
var APISecret = (_b = process.env) === null || _b === void 0 ? void 0 : _b.APISecret;
var PINATA_ENDPOINT = (_c = process.env) === null || _c === void 0 ? void 0 : _c.PINATA_ENDPOINT;
function uploadFile(params) {
    return __awaiter(this, void 0, void 0, function () {
        var imageUrl, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, cloudinary.uploader.upload(params, {
                            resource_type: "auto",
                        })];
                case 1:
                    imageUrl = _a.sent();
                    return [2 /*return*/, imageUrl.secure_url];
                case 2:
                    err_1 = _a.sent();
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.uploadFile = uploadFile;
// export async function uploadPdf(params:any) {
//     const response = await axios.post(PINATA_ENDPOINT, params, {
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//         headers: {
//           'Content-Type': `multipart/form-data;`,
//           'pinata_api_key': APIKey,
//           'pinata_secret_api_key': APISecret,
//         },
//       });
//       if (!response.data.IpfsHash) {
//         console.error(response.data);
//         // return res.status(500).json({error: 'Failed to upload file to Pinata'});
//       }
//       else{
//         return response.data.IpfsHash}
//       }
//# sourceMappingURL=imageupload.js.map