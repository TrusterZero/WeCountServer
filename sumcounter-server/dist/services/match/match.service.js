"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let MatchService = class MatchService {
    constructor() {
        this.activeMatches = [];
    }
    activate(match) {
        const activeMatch = this.getActiveMatchById(match.id);
        if (!activeMatch) {
            console.log(`match ${match.id} not found, activating it now`);
            return this.activeMatches[this.activeMatches.push(match) - 1];
        }
        else {
            console.log(`match ${match.id} found`);
        }
        return activeMatch;
    }
    deactivate(match) {
        console.log(`Deactivating match ${match.id}`);
        const matchIndex = this.activeMatches.indexOf(match);
        this.activeMatches.splice(matchIndex, 1);
    }
    addSummoner(newSummoner, match) {
        console.log(`Placing summoner ${newSummoner.name} in match ${match.id}`);
        const summoner = match.summoners.find((summoner) => summoner.id === newSummoner.id);
        summoner.active = true;
        match.activePlayers++;
    }
    getActiveMatchById(id) {
        console.log(`searching for match ${id}`);
        return this.activeMatches.find((activeMatch) => activeMatch.id === id);
    }
};
MatchService = __decorate([
    common_1.Injectable()
], MatchService);
exports.MatchService = MatchService;
//# sourceMappingURL=match.service.js.map