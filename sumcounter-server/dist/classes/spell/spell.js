"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spell {
    constructor(summonerId, spellData) {
        this.id = `${summonerId}${spellData.key}`;
        this.name = spellData.name;
        this.image = spellData.image.full;
        this.imageUrl = `https://ddragon.leagueoflegends.com/cdn/${spellData.version}/img/spell/${spellData.image.full}`;
        this.cooldown = [...spellData.cooldown];
    }
}
exports.Spell = Spell;
//# sourceMappingURL=spell.js.map