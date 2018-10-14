"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AxiosRequest {
    constructor(config) {
        for (const key of Object.keys(config)) {
            this[key] = config[key];
        }
    }
}
exports.AxiosRequest = AxiosRequest;
//# sourceMappingURL=axios-request.js.map