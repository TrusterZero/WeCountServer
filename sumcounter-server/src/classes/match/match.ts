import { Summoner } from "../summoner/summoner";

export class Match {
    id: number;
    gameMode: string;
    summoners: Summoner[];


    constructor(id: number, gameMode: string, summoners: Summoner[]) {
        this.id = id;
        this.gameMode = gameMode;
        this.summoners = summoners;
    }
}