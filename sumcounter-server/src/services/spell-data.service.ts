import { LocalDataService, LocalData } from "./local-data.service";
import { Injectable } from "../../node_modules/@nestjs/common";

export interface SpellData extends LocalData {
    image: string;
    cooldown: number
}

@Injectable()
export class SpellDataService extends LocalDataService<SpellData> {

    constructor() {
        super('spells.json');
    }
}