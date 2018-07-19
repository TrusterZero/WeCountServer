import { SpellDataService, SpellData } from "services/spell-data.service";

//const spellDataService: SpellDataService = new SpellDataService()

export class Spell {
    
    id: string;
    name: string;
    image: string;
    cooldown: number;

    constructor(spellId: string, spellDataService: SpellDataService){
        this.id = spellId;
        let spellData:SpellData = spellDataService.getItemByKey(this.id)
        
        if (spellData) {
            this.name = spellData.name;
            this.image = spellData.image;
            this.cooldown = spellData.cooldown;
        }
    }
}
