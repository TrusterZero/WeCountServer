import { Summoner } from "../summoner/summoner";

export class Match {
    id: number;
    summoners: Summoner[];


    constructor(id: number,summoners: Summoner[]) {
        this.id = id;
        this.summoners = summoners;
    }
}