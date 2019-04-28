import { ChampionDataService, ChampionData } from '../../services/champion-data.service';

//const championDataService: ChampionDataService = new ChampionDataService()

export class Champion {

    id: number;
    name: string;
    image: string;

    constructor(championId: number, private championDataService: ChampionDataService) {
        this.id = championId;

        const championData: ChampionData = this.championDataService.getItemByKey(this.id);

        if (championData) {
            this.name = championData.name;
            this.image = championData.image;
        }
    }
}
