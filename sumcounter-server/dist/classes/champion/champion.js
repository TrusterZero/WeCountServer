"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const champion_data_service_1 = require("../../services/champion-data.service");
const championDataService = new champion_data_service_1.ChampionDataService();
class Champion {
    constructor(championId) {
        this.id = championId;
        const championData = championDataService.getItemByKey(this.id);
        if (championData) {
            this.name = championData.name;
            this.image = championData.image;
        }
    }
}
exports.Champion = Champion;
//# sourceMappingURL=champion.js.map