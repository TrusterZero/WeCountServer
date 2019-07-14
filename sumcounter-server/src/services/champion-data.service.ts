import {LocalDataService, LocalData} from './local-data.service';
import {Injectable} from '@nestjs/common';
import {assetPath, config} from "./config-service";
import {ApiService} from "./api/api.service";
import {AxiosResponse} from "@nestjs/common/http/interfaces/axios.interfaces";
import {skip} from "rxjs/operators";
import {RawChampionCollection, RawChampionData} from "./api/api.interface";
import * as fs from "fs";

export interface ChampionData extends LocalData {
    image: string;
}

const filename = 'champions.json';

@Injectable()
export class ChampionDataService extends LocalDataService<ChampionData> {

    RIOT_CHAMPION_URL = `${this.ddragonUrl}champion.json`;

    constructor(private apiService: ApiService) {
        super(filename);
        config.pipe(skip(1)).subscribe(() => {
            this.apiService.get({url: this.RIOT_CHAMPION_URL})
                .subscribe((response: AxiosResponse) => this.processRawChampions(response),
                        error => {console.error('failure while update champions.json', error)});
        })
    }

    private processRawChampions(response: AxiosResponse): void {

        const championCollection: RawChampionCollection = response.data;
        const champions = championCollection.data;
        const processedChampionData = [];

        Object.keys(champions).forEach((key) => {
            const champion = champions[key] as RawChampionData;
            processedChampionData.push({
                key: champion.key,
                name: champion.name,
                image: champion.image.full
            })
        });

        fs.writeFile(`${assetPath}${filename}`  , JSON.stringify(processedChampionData),
            () => {this.refreshFile(filename)} )
    }
}
