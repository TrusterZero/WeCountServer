import { AxiosRequest } from '../axios-request/axios-request';
import { AxiosRequestConfig } from '@nestjs/common/http/interfaces/axios.interfaces';

export interface RiotHeader {
  'Origin': string;
  'Accept-Charset': string;
  'X-Riot-Token': string;
  'Accept-Language': string;
  'User-Agent': string;
}

export enum RegionalEndpoint {
  BR = 'br1',
  EUNE = 'eun1',
  EUW = 'euw1',
  JP = 'jp1',
  KR = 'kr',
  LAN = 'la1',
  LAS = 'la2',
  NA = 'na1',
  OCE = 'oc1',
  TR = 'tr1',
  RU = 'ru',
  PBE = 'pbe1'
}

export class RiotRequest extends AxiosRequest {

  constructor(region: string, riotToken: string, config: AxiosRequestConfig) {
    super(config);

    const regionEndpoint: RegionalEndpoint = RegionalEndpoint[region];
    console.log(region);
    if (!regionEndpoint) {
      return;
    }
    this.baseURL = `https://${regionEndpoint}.api.riotgames.com/lol/`;
    this.headers = this.creatRiotReader(riotToken);
  }

  private creatRiotReader(riotToken: string): RiotHeader {

    return {
      'Origin': 'https://developer.riotgames.com',
      'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Riot-Token': riotToken,
      'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    };
  }
}
