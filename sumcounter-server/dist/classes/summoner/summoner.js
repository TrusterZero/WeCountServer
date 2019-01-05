"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const champion_1 = require("../champion/champion");
const spell_1 = require("../spell/spell");
const REDUCED_CDR_AMOUNT = 0.95;
class Summoner {
    constructor(parameters) {
        this.active = false;
        const { summonerId, summonerName, championId, teamId, spell1Id, spell2Id, hasCDR, isRequester } = parameters;
        this.id = summonerId;
        this.name = summonerName;
        this.champion = new champion_1.Champion(championId);
        this.teamId = teamId;
        this.spell1 = new spell_1.Spell(this.id, spell1Id);
        this.spell2 = new spell_1.Spell(this.id, spell2Id);
        this.hasCDR = hasCDR;
        this.isRequester = isRequester;
        if (this.hasCDR) {
            this.spell1.cooldown = [this.spell1.cooldown[0] *= REDUCED_CDR_AMOUNT];
            this.spell2.cooldown = [this.spell2.cooldown[0] *= REDUCED_CDR_AMOUNT];
        }
    }
}
exports.Summoner = Summoner;
//# sourceMappingURL=summoner.js.map