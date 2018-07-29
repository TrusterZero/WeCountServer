import { SpellDataService, SpellData } from "services/spell-data.service";

const spellDataService: SpellDataService = new SpellDataService()

export class Spell {
    
    id: number;
    name: string;
    image: string;
    cooldown: number;

    constructor(spellId: number){
        this.id = spellId;
        let spellData:SpellData = spellDataService.getItemByKey(this.id)
        
        if (spellData) {
            this.name = spellData.name;
            this.image = spellData.image.full;
            this.cooldown = spellData.cooldown;
        }
    }
}
