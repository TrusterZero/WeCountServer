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
const fs = require("fs");
const common_1 = require("@nestjs/common");
let LocalDataService = class LocalDataService {
    constructor(fileName) {
        this.assetPath = 'assets/';
        this.localData = [];
        this.localData = this.getLocalData(fileName);
    }
    setVersion(latestApiVersion) {
        console.log(`Setting latest Api version to ${latestApiVersion}`);
        this.apiVersion = latestApiVersion;
    }
    getItemByKey(key) {
        const data = this.localData.find((item) => item.key.toString() === key.toString());
        if (data) {
            data.version = this.apiVersion;
        }
        if (!data) {
            console.error(`Champion with key: ${key} not found`);
            return null;
        }
        return data;
    }
    getLocalData(fileName) {
        const fileData = fs.readFileSync(`${this.assetPath}${fileName}`);
        let parsedContent;
        try {
            parsedContent = JSON.parse(fileData.toString());
        }
        catch (err) {
            console.warn('couldn\'t parse contents of', fileName);
        }
        return parsedContent;
    }
};
LocalDataService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [String])
], LocalDataService);
exports.LocalDataService = LocalDataService;
//# sourceMappingURL=local-data.service.js.map