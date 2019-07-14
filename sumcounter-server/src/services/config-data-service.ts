import * as fs from 'fs';
import {Injectable} from "@nestjs/common";
import {credentials} from 'classes/configValues';


export interface configData {
    name: string;
    value: any;
}

@Injectable()
export abstract class  ConfigDataService<T extends configData>  {
    private assetPath = credentials.assetPath;
    private localData: T[] = [];
    private apiVersion: string;


    protected constructor(fileName: string) {
        this.localData = this.getLocalData(fileName);
    }


    public setVersion(latestApiVersion: string) {
        console.log(`Setting latest Api version to ${latestApiVersion}`);
        this.apiVersion = latestApiVersion;
    }

    /**
     * fetches an item from the local data source
     *
     * @param key
     */
    getItemByKey(key: number): T {
        const data: T = this.localData.find((item: T) => item.key.toString() === key.toString());
        if(data) {
            data.version = this.apiVersion;
        }
        if(!data){
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
