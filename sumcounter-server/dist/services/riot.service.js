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
const api_service_1 = require("./api/api.service");
const match_1 = require("../classes/match/match");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const summoner_1 = require("../classes/summoner/summoner");
const riot_request_1 = require("../classes/riot-request/riot-request");
const credentials_1 = require("../classes/credentials");
const COSMIC_INSIGHT_ID = 8347;
const URL_PARTIAL = {
    SUMMONER: 'summoner/v3/summoners/by-name/',
    MATCH: 'spectator/v3/active-games/by-summoner/',
};
let RiotService = class RiotService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    getSummoner(region, userName) {
        const summonerRequest = new riot_request_1.RiotRequest(region, credentials_1.Credentials.riotKey, {
            url: `${URL_PARTIAL.SUMMONER}${userName}`,
        });
        return this.apiService.get(summonerRequest)
            .pipe(operators_1.catchError((err) => rxjs_1.throwError(err)), operators_1.map((response) => {
            return response.data;
        }));
    }
    getMatch(creationRequest) {
        const matchRequest = new riot_request_1.RiotRequest(creationRequest.region, credentials_1.Credentials.riotKey, {
            url: `${URL_PARTIAL.MATCH}${creationRequest.summonerId}`,
        });
        return this.apiService.get(matchRequest)
            .pipe(operators_1.catchError((err) => rxjs_1.throwError(err)), operators_1.map((response) => {
            const teamId = response.data.participants
                .find((participant) => Number(participant.summonerId) === Number(creationRequest.summonerId)).teamId;
            const summoners = this.convertParticipants(teamId, response.data.participants);
            return new match_1.Match(response.data.gameId, response.data.gameMode, summoners);
        }));
    }
    convertParticipants(teamId, participants) {
        const summoners = [];
        participants.forEach((participant) => {
            if (participant.teamId !== teamId) {
                summoners.push(new summoner_1.Summoner({
                    summonerId: participant.summonerId,
                    championId: participant.championId,
                    spell1Id: participant.spell1Id,
                    spell2Id: participant.spell2Id,
                    hasCDR: this.hasCDR(participant),
                }));
            }
        });
        return summoners;
    }
    hasCDR(user) {
        return user.perks.perkIds.includes(COSMIC_INSIGHT_ID);
    }
};
RiotService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], RiotService);
exports.RiotService = RiotService;
//# sourceMappingURL=riot.service.js.map