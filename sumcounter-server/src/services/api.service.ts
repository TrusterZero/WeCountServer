import { HttpService } from "../../node_modules/@nestjs/common";
import { Observable } from "../../node_modules/rxjs";
import { map } from 'rxjs/operators';

const BASE_URL = 'https://euw1.api.riotgames.com/lol/';
const URL_PARTIAL = {
    SUMMONER: 'summoner/v3/summoners/by-name/',
    MATCH: 'spectator/v3/active-games/by-summoner/'
} 
const HEADERCONFIG = {
    headers: {
        "Origin": "https://developer.riotgames.com",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Riot-Token": `${this.TEMP_API_KEY}`,
        "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    }
}

export class ApiService {

    constructor(private httpService: HttpService){ }

    //TODO: waarde moet duidelijk gedefinieerd worden in een interface
    getUser(userName: string): Observable<string> {
        const url = `${BASE_URL}${URL_PARTIAL.SUMMONER}${userName}`
        return this.httpService.get(
            url,
            HEADERCONFIG
        ).pipe(
            map((value) => {
                return '';
            })
        )
    }
}