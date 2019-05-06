import { LocalDataService, LocalData } from './local-data.service';
import { Injectable } from '@nestjs/common';
import {RiotService} from "./riot.service";

export interface ChampionData extends LocalData {
    image: string;
}

@Injectable()
export class ChampionDataService extends LocalDataService<ChampionData> {

    constructor() {
        super('champions.json');
    }
}
