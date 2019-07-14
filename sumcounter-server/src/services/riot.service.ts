import {Injectable, HttpService} from '@nestjs/common';
import {ApiService} from './api/api.service';
import {Match} from '../classes/match/match';
import {CurrentGameParticipant, MatchResponse, SummonerResponse} from './api/api.interface';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AxiosResponse} from '@nestjs/common/http/interfaces/axios.interfaces';
import {Summoner} from '../classes/summoner/summoner';
import {RiotRequest} from '../classes/riot-request/riot-request';
import {CreationRequest} from './socket/socket.interface';
import {credentials} from '../classes/configValues';
import {AxiosRequest} from "../classes/axios-request/axios-request";
import {ChampionData, ChampionDataService} from "./champion-data.service";
import {SpellData, SpellDataService} from "./spell-data.service";

const COSMIC_INSIGHT_ID = 8347;
const URL_PARTIAL = {
    SUMMONER: 'summoner/v4/summoners/by-name/',
    MATCH: 'spectator/v4/active-games/by-summoner/',
};


interface LocalDataSet {
    championData: ChampionData;
    spell1Data: SpellData;
    spell2Data: SpellData;
}

@Injectable()
export class RiotService {

    constructor(private apiService: ApiService, private championDataService: ChampionDataService, private spellDataService: SpellDataService) {

    }

    /**
     *
     * uses the UserName to receive all the information about a user from the Riot API
     *
     * @param userName
     */
    getSummoner(region, userName: string): Observable<SummonerResponse> {
        console.log(`Asking Riot for summoner: ${userName} from region ${region}`);
        const summonerRequest: RiotRequest = new RiotRequest(region, credentials.riotKey, {
            url: `${URL_PARTIAL.SUMMONER}${encodeURI(userName)}`,
        });

        return this.apiService.get<SummonerResponse>(summonerRequest)
            .pipe(catchError((err: any) => throwError(err)),
                map((response: AxiosResponse<SummonerResponse>) => {

                    return response.data;
                }),
            );
    }

    private getApiVersions(): Observable<AxiosResponse> {

        const versionRequest = new AxiosRequest({
            url: 'https://ddragon.leagueoflegends.com/api/versions.json'
        });

        return this.apiService.get(versionRequest)
    }

    public getLatestApiVersion(): Promise<string> {
        console.log(`Asking Riot for latest Api version`);
        return new Promise(((resolve, reject) =>  {
            this.getApiVersions().subscribe((response :AxiosResponse) => {
                const versions: string[] = response.data;
                const latestVersion: string = versions[0];
                resolve(latestVersion);
            })
        }));
    }

    /**
     *
     * Gets the all the information about a match from the Riot API and converts the data to a Match Object
     *
     * @param creationRequest
     */
    getMatch(creationRequest: CreationRequest): Observable<Match> {
        const matchRequest: RiotRequest = new RiotRequest(creationRequest.region, credentials.riotKey, {
            url: `${URL_PARTIAL.MATCH}${creationRequest.summonerId}`,
        });

        return this.apiService.get<MatchResponse>(matchRequest)
            .pipe(catchError((err: any) => throwError(err)),
                map((response: AxiosResponse<MatchResponse>) => {
                    const requesterId = creationRequest.summonerId;
                    const {participants, gameId, gameMode} = response.data;
                        const teamId = participants // TODO: check waarom 2 number parses wel werken
                            .find((participant: CurrentGameParticipant) => participant.summonerId === requesterId).teamId;

                        const summoners: Summoner[] = this.parseParticipants(requesterId,teamId, participants);
                        return new Match(gameId, gameMode, summoners);
                    },
                ));
    }

    /**
     *
     * Converts participants from the Riot API to Summoners used within We Count
     *
     * @param teamId
     * @param participants
     *
     */
    private parseParticipants(requesterId: string, teamId: number, participants: CurrentGameParticipant[]): Summoner[] {

        const summoners: Summoner[] = [];
        participants.forEach((participant: CurrentGameParticipant) => {
                const {summonerId, summonerName, teamId} = participant;
                const {championData, spell1Data, spell2Data} = this.getLocalData(participant) as LocalDataSet;

                summoners.push(
                    new Summoner({
                            summonerId,
                            championData,
                            summonerName,
                            teamId,
                            spell1Data,
                            spell2Data,
                            hasCDR: this.hasCDR(participant),
                            isRequester: summonerId === requesterId
                        },
                    ));
        });
        return summoners;
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

    private getLocalData(participant: CurrentGameParticipant) {
        const {championId, spell1Id, spell2Id} = participant;

        const championData = this.championDataService.getItemByKey(championId);
        const spell1Data = this.spellDataService.getItemByKey(spell1Id);
        const spell2Data = this.spellDataService.getItemByKey(spell2Id);

        if(!championData || !spell1Data || !spell2Data) {
            return null;
        } else {
            return {championData, spell1Data, spell2Data} as LocalDataSet
        }

    }

}


