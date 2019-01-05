import { SpellDataService, SpellData } from '../../services/spell-data.service';

const spellDataService: SpellDataService = new SpellDataService()

export class Spell {

    id: number;
    name: string;
    image: string;
    cooldown: number[];

  constructor(summonerId: number, spellId: number) {
    this.id = Number(`${summonerId}${spellId}`);
    const spellData: SpellData = spellDataService.getItemByKey(spellId);

    if (spellData) {
      this.name = spellData.name;
      this.image = spellData.image.full;
      this.cooldown = [...spellData.cooldown];
    }
  }
}
