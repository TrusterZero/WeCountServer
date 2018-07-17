import { Champion } from "../champion/champion"
import { Spell } from "../spell/spell"
import { ChampionDataService } from "services/champion-data.service";
import { SpellDataService } from "services/spell-data.service";

export interface SummonerParameters {
    summonerId: string;
    championId: string;
    spell1Id: string;
    spell2Id: string;
    hasCDR: boolean;
}

export class Summoner {
        id: string;
        champion: Champion;
        spell1: Spell;
        spell2: Spell;
        hasCDR = false;
    
    constructor(parameters: SummonerParameters,
                championDataService:ChampionDataService,
                spellDataService: SpellDataService) {

        this.id = parameters.summonerId;
        this.champion = new Champion(parameters.championId, championDataService);
        this.spell1 = new Spell(parameters.spell1Id, spellDataService);
        this.spell2 = new Spell(parameters.spell2Id, spellDataService);
        this.hasCDR = parameters.hasCDR;
    }
}
