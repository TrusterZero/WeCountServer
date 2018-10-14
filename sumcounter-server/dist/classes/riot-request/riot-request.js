"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_request_1 = require("../axios-request/axios-request");
var RegionalEndpoint;
(function (RegionalEndpoint) {
    RegionalEndpoint["BR"] = "br1";
    RegionalEndpoint["EUNE"] = "eun1";
    RegionalEndpoint["EUW"] = "euw1";
    RegionalEndpoint["JP"] = "jp1";
    RegionalEndpoint["KR"] = "kr";
    RegionalEndpoint["LAN"] = "la1";
    RegionalEndpoint["LAS"] = "la2";
    RegionalEndpoint["NA"] = "na1";
    RegionalEndpoint["OCE"] = "oc1";
    RegionalEndpoint["TR"] = "tr1";
    RegionalEndpoint["RU"] = "ru";
    RegionalEndpoint["PBE"] = "pbe1";
})(RegionalEndpoint = exports.RegionalEndpoint || (exports.RegionalEndpoint = {}));
class RiotRequest extends axios_request_1.AxiosRequest {
    constructor(region, riotToken, config) {
        super(config);
        const regionEndpoint = RegionalEndpoint[region];
        if (!regionEndpoint) {
            return;
        }
        this.baseURL = `https://${regionEndpoint}.api.riotgames.com/lol/`;
        this.headers = this.creatRiotReader(riotToken);
    }
    creatRiotReader(riotToken) {
        return {
            'Origin': 'https://developer.riotgames.com',
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Riot-Token': riotToken,
            'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        };
    }
}
exports.RiotRequest = RiotRequest;
//# sourceMappingURL=riot-request.js.map