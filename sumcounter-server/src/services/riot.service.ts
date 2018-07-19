import { Injectable, HttpService } from '@nestjs/common';
import { Summoner } from 'classes/summoner/summoner';
import { ApiService } from './api/api.service'
import { ChampionDataService } from './champion-data.service';
import { SpellDataService } from './spell-data.service';

@Injectable()
export class RiotService {
    private readonly apiService = new ApiService(new HttpService)
    private readonly COSMIC_INSIGHT_ID = 8347;

    constructor(private championDataService: ChampionDataService,
                private spellDataService: SpellDataService) { }

    /**
     * 
     * Returns a list which containts all the information we need
     * 
     * @param userName 
     */
    getMatchData(userName): Promise<Object> {//moet volgens mij array van summoners worden
        let matchData = {
            summoners: []
        };
//TODO geen promises !!!! 
        return new Promise((resolve, reject) => {
            this.apiService.getMatch(userName).then((participants) => {

                participants.forEach(participant => {
                    matchData.summoners.push(
                        new Summoner({
                            summonerId: participant.summonerId,
                            championId: participant.championId,
                            spell1Id: participant.spell1Id,
                            spell2Id: participant.spell2Id,
                            hasCDR: this.hasCDR(participant)
                        }
                        ))
                });
                
                resolve(matchData);
            })
        })
    }

    /**
     * 
     * Checks if the user has a rune that applies extra CDR (cooldown reduction)
     * to the Spell
     * 
     * @param user
     */
    hasCDR(user): boolean {
        return user.perks.perkIds.includes(this.COSMIC_INSIGHT_ID);
    }
}
