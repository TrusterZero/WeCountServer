import { Injectable, HttpService } from '@nestjs/common';
import { Summoner } from 'classes/summoner/summoner';
import { ChampionDataService } from './champion-data.service';
import { SpellDataService } from './spell-data.service';

@Injectable()
export class RiotService {

    private readonly TEMP_API_KEY = "RGAPI-4bf4ffc2-6214-469f-8d86-42dcbb13b71e";
    private readonly COSMIC_INSIGHT_ID = 8347;
    private readonly config = {
        headers: {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": `${this.TEMP_API_KEY}`,
            "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        }
    }

    constructor(private readonly httpService: HttpService,
                private championDataService: ChampionDataService,
                private spellDataService: SpellDataService) { }

    getUser = (userName) => {
        let userUrl = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${userName}`;
        return new Promise((resolve, reject) => {
            this.httpService.get(
                userUrl,
                this.config
            ).subscribe((res) => {
                resolve(res.data)
            },
                error => { console.log(error) })
        })
    }

    getMatch = (userName) => {
        return new Promise((resolve, reject) => {
            this.getUser(userName).then((user) => {
                let matchUrl = `https://euw1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${user["id"]}`;
                this.httpService.get(
                    matchUrl,
                    this.config
                ).subscribe((res) => {
                    if (res.data && res.data["status_code"]) {
                        reject(`${res.data["status_code"]}: ${res.data.message}`)
                    }
                    let match = this.getMatchData(res.data.participants)
                    resolve(match)
                }, error => { console.log(error) })
            })
        })
    }

    getMatchData(participants) {
        let matchData = {
            summoners: []
        };

        participants.forEach(participant => {
            matchData.summoners.push(
                new Summoner({
                    summonerId: participant.summonerId,
                    championId: participant.championId,
                    spell1Id: participant.spell1Id,
                    spell2Id: participant.spell2Id,
                    hasCDR: this.hasCDR(participant)
                },
                this.championDataService,
                this.spellDataService)
            )
        });
        return matchData;
    }

    //ik zou deze op een andere plek willen hebben maar waar?
    hasCDR = (user) => {
        return user.perks.perkIds.includes(this.COSMIC_INSIGHT_ID);
    }
}
