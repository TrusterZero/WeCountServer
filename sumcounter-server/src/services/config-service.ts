import {BehaviorSubject, Observable, timer} from "rxjs";
import * as fs from "fs";
import {Injectable} from "@nestjs/common";
import {AxiosResponse} from "@nestjs/common/http/interfaces/axios.interfaces";
import {AxiosRequest} from "../classes/axios-request/axios-request";
import {ApiService} from "./api/api.service";

export interface Config {
    apiVersion: string;
}

const HourInMiliSeconds = 3000;

export let assetPath = 'assets/';
const configFilePath = `${assetPath}config.json`;
const RIOT_API_VERSION_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';

@Injectable()
export class ConfigService {

    constructor(private apiService: ApiService) {
        this.watchConfigFile();
        this.checkApiVersion();
    }

    public static getConfig() {
        let currentConfig;
        try {
            const fileData: Buffer = fs.readFileSync(configFilePath);
            currentConfig = JSON.parse(fileData.toString());
        } catch (err) {
                console.warn('couldn\'t parse contents of config loading runtime config');
                return config.getValue()
        }
        return currentConfig;
    }

    private getApiVersions(): Observable<AxiosResponse> {
        const versionRequest = new AxiosRequest({
            url: RIOT_API_VERSION_URL
        });
        return this.apiService.get(versionRequest)
    }

    private checkApiVersion(): void {
        this.getApiVersions().subscribe((response: AxiosResponse) => {
            timer(HourInMiliSeconds).subscribe(() => this.checkApiVersion());
            const currentConfig = ConfigService.getConfig();

            if(!currentConfig || !currentConfig.apiVersion) {
                return
            }

            const currentApiVersion = currentConfig.apiVersion;
            const latestApiVersion = response.data[0];

            if (currentApiVersion !== latestApiVersion) {
                this.updateApiVersion(latestApiVersion)
            }
        });
    }

    private updateApiVersion(latestApiVersion: string) {
        let currentConfig : Config = ConfigService.getConfig();
        Object.assign(currentConfig, {apiVersion: latestApiVersion});
        this.updateConfig(currentConfig);
    }

    private updateConfig(newConfig) {
        fs.writeFile(`${assetPath}config.json`, JSON.stringify(newConfig), () => config.next(newConfig))
    }

    refreshConfig() {
        this.updateConfig(ConfigService.getConfig());
        timer(HourInMiliSeconds / 2).subscribe(() => this.refreshConfig());
    }

    private watchConfigFile() {
        fs.watch(configFilePath, (event, filename) => {
            if (filename && event === 'change') {
                config.next(ConfigService.getConfig());
            }
        });
    }
}

export let config: BehaviorSubject<Config> = new BehaviorSubject<Config>(ConfigService.getConfig());


