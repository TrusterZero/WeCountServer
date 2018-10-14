"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const champion_1 = require("../champion/champion");
const spell_1 = require("../spell/spell");
const REDUCED_CDR_AMOUNT = 0.95;
class Summoner {
    constructor(parameters) {
        this.hasCDR = false;
        this.id = parameters.summonerId;
        this.champion = new champion_1.Champion(parameters.championId);
        this.spell1 = new spell_1.Spell(this.id, parameters.spell1Id);
        this.spell2 = new spell_1.Spell(this.id, parameters.spell2Id);
        this.hasCDR = parameters.hasCDR;
        if (this.hasCDR) {
            this.spell1.cooldown *= REDUCED_CDR_AMOUNT;
            this.spell2.cooldown *= REDUCED_CDR_AMOUNT;
        }
    }
}
exports.Summoner = Summoner;
//# sourceMappingURL=summoner.js.map