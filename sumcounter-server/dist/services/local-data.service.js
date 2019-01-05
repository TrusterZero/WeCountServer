"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class LocalDataService {
    constructor(fileName) {
        this.assetPath = 'assets/';
        this.localData = [];
        this.localData = this.getLocalData(fileName);
    }
    getItemByKey(key) {
        return this.localData.find((item) => item.key.toString() === key.toString());
    }
    getLocalData(fileName) {
        const fileData = fs.readFileSync(`${this.assetPath}${fileName}`);
        let parsedContent;
        try {
            parsedContent = JSON.parse(fileData.toString());
        }
        catch (err) {
            console.log(err);
            console.warn('couldn\'t parse contents of', fileName);
        }
        return parsedContent;
    }
}
exports.LocalDataService = LocalDataService;
//# sourceMappingURL=local-data.service.js.map