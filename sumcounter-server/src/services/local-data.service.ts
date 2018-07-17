
import * as fs from "fs";


export interface LocalData {
    key: string;
    name: string;
}

export abstract class LocalDataService<T extends LocalData>  {
    assetPath = "assets/";
    localData: T[] = [];

    constructor(fileName: string) {
        this.localData = this.getLocalData(fileName);
    }

    /**
     * fetches an item from the local data source
     * 
     * @param key 
     */
    getItemByKey(key: string): T {
        return this.localData.find((item: T) => item.key === key.toString());
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
            console.warn("couldn't parse contents of", fileName);
        }

        return parsedContent;
    }

}
