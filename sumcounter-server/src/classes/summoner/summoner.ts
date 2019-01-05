import { Champion } from '../champion/champion'
import { Spell } from '../spell/spell'
import {Socket} from "socket.io";

const REDUCED_CDR_AMOUNT = 0.95;

export interface SummonerParameters {
    summonerId: number;
    summonerName:string;
    championId: number;
    teamId: number;
    spell1Id: number;
    spell2Id: number;
    hasCDR: boolean;
    isRequester: boolean
}

export class Summoner {
        id: number;
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
        const {summonerId, summonerName, championId, teamId, spell1Id, spell2Id, hasCDR, isRequester} = parameters;

        this.id = summonerId;
        this.name = summonerName;
        this.champion = new Champion(championId);
        this.teamId = teamId;
        this.spell1 = new Spell(this.id, spell1Id);
        this.spell2 = new Spell(this.id, spell2Id);
        this.hasCDR = hasCDR;
        this.isRequester = isRequester;
        if (this.hasCDR) {
            this.spell1.cooldown = [this.spell1.cooldown[0] *= REDUCED_CDR_AMOUNT];
            this.spell2.cooldown = [this.spell2.cooldown[0] *= REDUCED_CDR_AMOUNT];
        }
    }
}
