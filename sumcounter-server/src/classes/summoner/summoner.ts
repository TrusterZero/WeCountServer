import {Champion} from '../champion/champion'
import {Spell} from '../spell/spell'
import {Socket} from "socket.io";
import {ChampionData} from "../../services/champion-data.service";
import {SpellData} from "../../services/spell-data.service";

const REDUCED_CDR_AMOUNT = 0.95;

export interface SummonerParameters {
    summonerId: string;
    summonerName: string;
    championData: ChampionData;
    teamId: number;
    spell1Data: SpellData;
    spell2Data: SpellData;
    hasCDR: boolean;
    isRequester: boolean
}

export class Summoner {
    id: string;
    name: string;
    champion: Champion;
    teamId: number;
    spell1: Spell;
    spell2: Spell;
    hasCDR: boolean;
    clientId: string; // Denk dat deze weg moet
    active = false;
    isRequester: boolean;

    constructor(parameters: SummonerParameters) {
        const {summonerId, summonerName,championData, teamId, spell1Data, spell2Data, hasCDR, isRequester} = parameters;

        this.id = summonerId;
        this.name = summonerName;

        this.champion = new Champion(championData);
        this.teamId = teamId;

        this.spell1 = new Spell(this.id, spell1Data);

        this.spell2 = new Spell(this.id, spell2Data);
        this.hasCDR = hasCDR;
        this.isRequester = isRequester;
        if (this.hasCDR) {
            this.spell1.cooldown = [this.spell1.cooldown[0] *= REDUCED_CDR_AMOUNT];
            this.spell2.cooldown = [this.spell2.cooldown[0] *= REDUCED_CDR_AMOUNT];
        }
    }
}
