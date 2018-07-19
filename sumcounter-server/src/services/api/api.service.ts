import { HttpService } from "@nestjs/common";
import { Observable, Timestamp } from "rxjs";
import { map } from 'rxjs/operators';
import { AxiosResponse } from "axios";
import { Summoner } from "classes/summoner/summoner";
import { SummonerResponse, MatchResponse } from "./api.interface";


const TEMP_API_KEY = "RGAPI-420c82da-1baa-4bf9-944b-888328adf9e3";
const BASE_URL = 'https://euw1.api.riotgames.com/lol/';
const URL_PARTIAL = {
    SUMMONER: 'summoner/v3/summoners/by-name/',
    MATCH: 'spectator/v3/active-games/by-summoner/'
}
const HEADERCONFIG = {
    headers: {
        "Origin": "https://developer.riotgames.com",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Riot-Token": `${TEMP_API_KEY}`,
        "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    }
}




export class ApiService {

    constructor(private httpService: HttpService) { }

    /**
     * 
     *uses the UserName to recieve all the information about a user
     * 
     *@param userName 
     * 
     */
    getSummoner(userName: string): Observable<SummonerResponse> {
        return this.get<SummonerResponse>(`${URL_PARTIAL.SUMMONER}${userName}`)
            .pipe(
                map((response: AxiosResponse<SummonerResponse>) => {
                    return response.data;
                })
            );

    }

    /**
     * 
     * @param summonerId
     */
    getMatch(summonerId: string): Observable<Match> {
        return this.get<MatchResponse>(`${URL_PARTIAL.MATCH}${summonerId}`)
            .pipe(
                map((response: AxiosResponse<MatchResponse>) => {//MATCHRESPONSE word Match
                    return response.data;
                })
            );
    }

    /**
     * 
     * Fires a GET request to given endpoint
     * 
     * @param endpoint 
     */
    private get<T>(endpoint: string): Observable<AxiosResponse<T>> {
        return this.httpService.get(
            `${BASE_URL}${endpoint}`,
            HEADERCONFIG
        )
    }
}

