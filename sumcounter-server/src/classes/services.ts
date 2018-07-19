import { ChampionDataService } from "services/champion-data.service";
import { SpellDataService } from "services/spell-data.service";

export class SERVICES {
    
    championDataService: ChampionDataService = new ChampionDataService();
    SpellDataService: SpellDataService = new SpellDataService();

    constructor() { }

    
}