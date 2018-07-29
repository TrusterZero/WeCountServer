import { HttpService } from "@nestjs/common";
import { Observable, Timestamp } from "rxjs";
import { map } from 'rxjs/operators';
import { AxiosResponse } from "axios";
import { Summoner } from "classes/summoner/summoner";
import { SummonerResponse, MatchResponse, CurrentGameParticipant } from "./api.interface";
import { Match } from "classes/match/match";
import { json } from "../../../node_modules/@types/express";


const TEMP_API_KEY = "RGAPI-4f53eb56-758d-4cf8-b603-cae2d334c4ce";
const BASE_URL = 'https://euw1.api.riotgames.com/lol/';
const COSMIC_INSIGHT_ID = 8347;
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
     *uses the UserName to recieve all the information about a user from the Riot API
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
     *  Gets the all the information about a match from the Riot API and converts the data to a Match Object
     * 
     * @param summonerId
     */
    getMatch(summonerId: number): Observable<Match> {
        return this.get<MatchResponse>(`${URL_PARTIAL.MATCH}${summonerId}`)
            .pipe(
                map((response: AxiosResponse<MatchResponse>) => {
                    let teamId = response.data.participants.find((element) => element.summonerId === summonerId).teamId;

                    let participants: Summoner[] = [];

                    response.data.participants.forEach((participant: CurrentGameParticipant) => {
                        if (participant.teamId === teamId) {
                            participants.push(
                                new Summoner({
                                    summonerId: participant.summonerId,
                                    championId: participant.championId,
                                    spell1Id: participant.spell1Id,
                                    spell2Id: participant.spell2Id,
                                    hasCDR: this.hasCDR(participant)
                                }
                                ))
                        }
                    });
                    let match = new Match(response.data.gameId, participants);
                    console.log(JSON.stringify(match, null, 2))
                    return match;
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

    /**
 * 
 * Checks if the user has a rune that applies extra CDR (cooldown reduction)
 * to the Spell
 * 
 * @param user
 */
    private hasCDR(user): boolean {
        return user.perks.perkIds.includes(COSMIC_INSIGHT_ID);
    }
}

