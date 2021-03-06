import * as fs from 'fs';
import {Injectable} from "@nestjs/common";
import {credentials} from '../classes/configValues'
import {assetPath, Config, config} from "./config-service";
import {skip} from "rxjs/operators";


export interface LocalData {
    key: number;
    version: string;
    name: string;
}

@Injectable()
export abstract class LocalDataService<T extends LocalData> {
    private assetPath = assetPath;
    private localData: T[] = [];
    private apiVersion: string;
    public ddragonUrl: string;

    protected constructor(fileName: string) {
        this.refreshFile(fileName);
        const ignoreConfigInitiation = config.pipe(skip(1));
        ignoreConfigInitiation.subscribe((config: Config) => {
            if(config){
                this.setVersion(config.apiVersion)
            }
        });
    }

    public refreshFile(fileName) {
        this.localData = this.getLocalData(fileName);
    }

    public setVersion(latestApiVersion: string) {
        this.apiVersion = latestApiVersion;
        this.ddragonUrl = `http://ddragon.leagueoflegends.com/cdn/${this.apiVersion}/data/en_US/`;
    }

    /**
     * fetches an item from the local data source
     *
     * @param key
     */
    getItemByKey(key: number): T {
        const data: T = this.localData.find((item: T) => item.key.toString() === key.toString());
        if (data) {
            data.version = this.apiVersion;
        }
        if (!data) {
            console.error(`Champion with key: ${key} not found`);
            return null;
        }

        return data;
    }

    /**
     * reads the passed JSON file containing local data
     *
     * @param fileName
     */
    private getLocalData(fileName: string): T[] {
        const fileData: Buffer = fs.readFileSync(`${this.assetPath}${fileName}`);
        let parsedContent: T[];

        try {
            parsedContent = JSON.parse(fileData.toString());
        } catch (err) {
            console.warn('couldn\'t parse contents of', fileName);
        }

        return parsedContent;
    }

}
