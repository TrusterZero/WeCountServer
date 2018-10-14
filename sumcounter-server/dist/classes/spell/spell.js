"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spell_data_service_1 = require("../../services/spell-data.service");
const spellDataService = new spell_data_service_1.SpellDataService();
class Spell {
    constructor(summonerId, spellId) {
        this.id = Number(`${summonerId}${spellId}`);
        const spellData = spellDataService.getItemByKey(spellId);
        if (spellData) {
            this.name = spellData.name;
            this.image = spellData.image.full;
            this.cooldown = spellData.cooldown;
        }
    }
}
exports.Spell = Spell;
//# sourceMappingURL=spell.js.map