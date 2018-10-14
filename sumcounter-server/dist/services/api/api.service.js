"use strict";
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
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
function isAxiosError(error) {
    return typeof error.config !== 'undefined';
}
exports.isAxiosError = isAxiosError;
let ApiService = class ApiService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    get(requestConfig) {
        return this.httpService.request(requestConfig);
    }
    handleError(err, caught) {
        const loadingError$ = new rxjs_1.Subject();
        return loadingError$;
    }
};
ApiService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map