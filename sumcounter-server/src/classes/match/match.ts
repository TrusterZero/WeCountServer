import { Summoner } from '../summoner/summoner';
import {CooldownActivationData} from "../../services/socket/socket.interface";

export class Match {
    id: number;
    gameMode: string;
    summoners: Summoner[];
    activePlayers: number = 0;
    spellHistory: CooldownActivationData[] = [];

    constructor(id: number, gameMode: string, summoners: Summoner[]) {
        this.id = id;
        this.gameMode = gameMode;
        this.summoners = summoners;
    }
}