import {SpellDataService, SpellData} from '../../services/spell-data.service';


export class Spell {

    id: string;
    name: string;
    image: string;
    imageUrl: string;
    cooldown: number[];

    constructor(summonerId: string, spellData: SpellData) {
        this.id = `${summonerId}${spellData.key}`;
        this.name = spellData.name;
        this.image = spellData.image.full;
        this.imageUrl = `https://ddragon.leagueoflegends.com/cdn/${spellData.version}/img/spell/${spellData.image.full}`;
        this.cooldown = [...spellData.cooldown];
    }
}
