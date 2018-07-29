import { Champion } from "../champion/champion"
import { Spell } from "../spell/spell"
import { ChampionDataService } from "services/champion-data.service";
import { SpellDataService } from "services/spell-data.service";

export interface SummonerParameters {
    summonerId: number;
    championId: number;
    spell1Id: number;
    spell2Id: number;
    hasCDR: boolean;
}

export class Summoner {
        id: number;
        champion: Champion;
        spell1: Spell;
        spell2: Spell;
        hasCDR = false;
    
    constructor(parameters: SummonerParameters) {

        this.id = parameters.summonerId;
        this.champion = new Champion(parameters.championId);
        this.spell1 = new Spell(parameters.spell1Id);
        this.spell2 = new Spell(parameters.spell2Id);
        this.hasCDR = parameters.hasCDR;
        if(this.hasCDR) {
            this.spell1.cooldown *= 0.95
            this.spell2.cooldown *= 0.95
        }
    }
}
