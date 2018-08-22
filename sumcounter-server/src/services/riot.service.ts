import { Injectable, HttpService } from '@nestjs/common';
import { ApiService } from './api/api.service';
import { Match } from 'classes/match/match';
import { CurrentGameParticipant, MatchResponse, SummonerResponse } from './api/api.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from '@nestjs/common/http/interfaces/axios.interfaces';
import { Summoner } from '../classes/summoner/summoner';
import { RiotRequest } from '../classes/request-header/request-header';
import { CreationRequest} from './socket/socket.interface';

const RIOT_TOKEN = 'RGAPI-fcd59358-5682-489e-9348-3a35fe99ce24';
const COSMIC_INSIGHT_ID = 8347;
const URL_PARTIAL = {
  SUMMONER: 'summoner/v3/summoners/by-name/',
  MATCH: 'spectator/v3/active-games/by-summoner/',
};

@Injectable()
export class RiotService {
  private readonly apiService = new ApiService(new HttpService());

  constructor() {
  }

  /**
   *
   * uses the UserName to receive all the information about a user from the Riot API
   *
   * @param userName
   */
  getSummoner(region, userName: string): Observable<SummonerResponse> {
    const summonerRequest: RiotRequest = new RiotRequest(region, RIOT_TOKEN, {
      url: `${URL_PARTIAL.SUMMONER}${userName}`,
    });

    return this.apiService.get<SummonerResponse>(summonerRequest)
      .pipe(
        map((response: AxiosResponse<SummonerResponse>) => {
          return response.data;
        }),
      );
  }

  /**
   *
   * Gets the all the information about a match from the Riot API and converts the data to a Match Object
   *
   * @param creationRequest
   */
  getMatch(creationRequest: CreationRequest): Observable<Match> {

    const matchRequest: RiotRequest = new RiotRequest(creationRequest.region, RIOT_TOKEN, {
      url: `${URL_PARTIAL.MATCH}${creationRequest.summonerId}`,
    });

    return this.apiService.get<MatchResponse>(matchRequest)
      .pipe(
        map((response: AxiosResponse<MatchResponse>) => {

          const teamId = response.data.participants // TODO: check waarom 2 number parses wel werken
            .find((participant) => Number(participant.summonerId) === Number(creationRequest.summonerId)).teamId;
          const summoners: Summoner[] = this.convertParticipants(teamId, response.data.participants)

          return new Match(response.data.gameId, summoners);
        }),
      );
  }

  /**
   *
   * Converts participants from the Riot API to Summoners used within Sumcounter
   *
   * @param teamId
   * @param participants
   */
  private convertParticipants(teamId: number, participants: CurrentGameParticipant[]): Summoner[] {

    const summoners: Summoner[] = [];

    participants.forEach((participant: CurrentGameParticipant) => {
      if (participant.teamId === teamId) {
        summoners.push(
          new Summoner({
              summonerId: participant.summonerId,
              championId: participant.championId,
              spell1Id: participant.spell1Id,
              spell2Id: participant.spell2Id,
              hasCDR: this.hasCDR(participant),
            },
          ));
      }
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

  // /**
  //  *
  //  * Returns a list which containts all the information we need
  //  *
  //  * @param userName
  //  */
  // getMatchData(userName: string) {// moet volgens mij array van summoners worden
  //
  //   this.getSummoner(userName).subscribe((summonerResponse: SummonerResponse) => {
  //     this.getMatch(summonerResponse.id).subscribe((match: Match) => {
  //       return match;
  //     });
  //   });
  //
  // }

}
