import { LocalDataService, LocalData } from "./local-data.service";
import { Injectable } from "../../node_modules/@nestjs/common";

export interface ChampionData extends LocalData {
    image: string;
}

@Injectable()
export class ChampionDataService extends LocalDataService<ChampionData> {

    constructor() {
        super('champions.json');
    }
}
