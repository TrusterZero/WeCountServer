import { ChampionDataService, ChampionData } from "services/champion-data.service";

//const championDataService: ChampionDataService = new ChampionDataService()

export class Champion {

    id: string;
    name: string;
    image: string;

    constructor(championId: string, championDataService: ChampionDataService) {
        this.id = championId;

        let championData: ChampionData = championDataService.getItemByKey(this.id);

        if (championData) {
            this.name = championData.name;
            this.image = championData.image;
        }
    }
}
