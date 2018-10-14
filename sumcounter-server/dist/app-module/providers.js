"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_service_1 = require("./app.service");
const riot_service_1 = require("../services/riot.service");
const champion_data_service_1 = require("../services/champion-data.service");
const spell_data_service_1 = require("../services/spell-data.service");
const socket_service_1 = require("../services/socket/socket.service");
const api_service_1 = require("../services/api/api.service");
const common_1 = require("@nestjs/common");
exports.PROVIDERS = [
    app_service_1.AppService,
    api_service_1.ApiService,
    common_1.HttpService,
    riot_service_1.RiotService,
    champion_data_service_1.ChampionDataService,
    spell_data_service_1.SpellDataService,
    socket_service_1.EventsGateway,
];
//# sourceMappingURL=providers.js.map