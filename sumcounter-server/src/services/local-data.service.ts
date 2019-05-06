import * as fs from 'fs';
import {RiotService} from "./riot.service";
import {Injectable} from "@nestjs/common";


export interface LocalData {
    key: number;
    version: string;
    name: string;
}

@Injectable()
export abstract class LocalDataService<T extends LocalData>  {
    private assetPath = 'assets/';
    private localData: T[] = [];
    private apiVersion: string;


    protected constructor(fileName: string) {
        this.localData = this.getLocalData(fileName);
    }


    public setVersion(latestApiVersion: string) {
        console.log(`Setting latest Api version to ${latestApiVersion}`)
        this.apiVersion = latestApiVersion;
    }

    /**
     * fetches an item from the local data source
     *
     * @param key
     */
    getItemByKey(key: number): T {
        const data: T = this.localData.find((item: T) => item.key.toString() === key.toString());
        data.version = this.apiVersion;
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
