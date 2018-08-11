import { Injectable, HttpService } from '@nestjs/common';
import { Summoner } from 'classes/summoner/summoner';
import { ApiService } from './api/api.service';
import { ChampionDataService } from './champion-data.service';
import { SpellDataService } from './spell-data.service';
import { Match } from 'classes/match/match';
import { Observable } from '../../node_modules/rxjs';
import { SummonerResponse } from './api/api.interface';
import { resolve } from 'url';

@Injectable()
export class RiotService {
    private readonly apiService = new ApiService(new HttpService());

    constructor() { }

    /**
     *
     * Returns a list which containts all the information we need
     *
     * @param userName
     */
    getMatchData(userName: string) {// moet volgens mij array van summoners worden

        this.apiService.getSummoner(userName).subscribe((summonerResponse: SummonerResponse) => {
           this.apiService.getMatch(summonerResponse.id).subscribe((match: Match) => {
               return match;
           });
         });

    }

}
