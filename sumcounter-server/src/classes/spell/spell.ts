import { SpellDataService, SpellData } from '../../services/spell-data.service';

//const spellDataService: SpellDataService = new SpellDataService();

export class Spell {

    id: string;
    name: string;
    image: string;
    imageUrl: string;
    cooldown: number[];

  constructor(summonerId: string, spellId: number, private spellDataService: SpellDataService) {
    this.id = `${summonerId}${spellId}`;
    const spellData: SpellData = spellDataService.getItemByKey(spellId);

    if (spellData) {
      this.name = spellData.name;
      this.image = spellData.image.full;
      this.imageUrl = `https://ddragon.leagueoflegends.com/cdn/${spellData.version}/img/spell/${spellData.image.full}`;
      this.cooldown = [...spellData.cooldown];
    }
  }
}
