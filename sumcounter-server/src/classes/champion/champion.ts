import { ChampionDataService, ChampionData } from '../../services/champion-data.service';
import {RiotService} from "../../services/riot.service";
import {Inject} from "@nestjs/common";

export class Champion {

    id: number;
    name: string;
    image: string;

    constructor(championData: ChampionData) {
        this.id = championData.key;
        this.name = championData.name;
        this.image = championData.image;
    }
}
