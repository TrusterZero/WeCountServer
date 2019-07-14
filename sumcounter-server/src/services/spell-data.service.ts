import { LocalDataService, LocalData } from './local-data.service';
import { Injectable } from '@nestjs/common';
import {RiotService} from "./riot.service";
import {config} from "./config-service";

interface SpellImage {

    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    g: number;
}

const filename= 'spells.json';

export interface SpellData extends LocalData {
    image: SpellImage;
    cooldown: number[];
}

@Injectable()
export class SpellDataService extends LocalDataService<SpellData> {
     constructor() {
         super(filename);
         config.subscribe(() => this.refreshFile(filename))
    }
}