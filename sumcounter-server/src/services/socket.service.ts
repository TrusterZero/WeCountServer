import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Match } from 'classes/match/match';
import { Summoner } from 'classes/summoner/summoner';
//import { Server, Client } from '../../node_modules/@types/socket.io';




export interface startRequest {
  summonerName: string;
}

export interface CooldownActivationData {
  Summoner: Summoner;
  SpellId: number;
  TimeStamp: number; //unix timestamp datatype
}


@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server

  @SubscribeMessage("startCooldown")
  sumUsed(client, data: CooldownActivationData) {
    console.log(data)
    this.server.emit("sumUsed", data)
  }

  @SubscribeMessage('events')
  onEvent(client, data): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];
    console.log(data);

    return from(response).pipe(map(res => ({ event, data: res })));
  }

  @SubscribeMessage('match')
  match(client, data) {
    let event = 'matchReturn';
    console.log(client)

    return ({ event, 'data': this.matchData })
  }

  matchData: Match = JSON.parse(`{
        "id": 3710500985,
        "summoners": [
          {
            "hasCDR": false,
            "id": 81363566,
            "champion": {
              "id": 62,
              "name": "Wukong",
              "image": "MonkeyKing.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": {
              "id": 14,
              "name": "Ignite",
              "image": "SummonerDot.png",
              "cooldown": [
                210
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 85740805,
            "champion": {
              "id": 25,
              "name": "Morgana",
              "image": "Morgana.png"
            },
            "spell1": {
              "id": 14,
              "name": "Ignite",
              "image":"SummonerDot.png",
              "cooldown": [
                210
              ]
            },
            "spell2": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 105806243,
            "champion": {
              "id": 21,
              "name": "Miss Fortune",
              "image": "MissFortune.png"
            },
            "spell1": {
              "id": 7,
              "name": "Heal",
              "image":"SummonerHeal.png",
              "cooldown": [
                240
              ]
            },
            "spell2": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 41668501,
            "champion": {
              "id": 203,
              "name": "Kindred",
              "image": "Kindred.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": {
              "id": 11,
              "name": "Smite",
              "image": "SummonerSmite.png",
              "cooldown": [
                75
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 100608941,
            "champion": {
              "id": 238,
              "name": "Zed",
              "image": "Zed.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": {
              "id": 14,
              "name": "Ignite",
              "image": "SummonerDot.png",
              "cooldown": [
                210
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 64846826,
            "champion": {
              "id": 142
            },
            "spell1": {
              "id": 14,
              "name": "Ignite",
              "image": "SummonerDot.png",
              "cooldown": [
                210
              ]
            },
            "spell2": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 60300963,
            "champion": {
              "id": 72,
              "name": "Skarner",
              "image": "Skarner.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": {
              "id": 11,
              "name": "Smite",
              "image": "SummonerSmite.png",
              "cooldown": [
                75
              ]
            }
          },
          {
            "hasCDR": true,
            "id": 95428923,
            "champion": {
              "id": 117,
              "name": "Lulu",
              "image": "Lulu.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": "SummonerExhaust.png",
              "cooldown": [
                210
              ]
            },
          {
            "hasCDR": false,
            "id": 108857019,
            "champion": {
              "id": 18,
              "name": "Tristana",
              "image": "Tristana.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": {
              "id": 21,
              "name": "Barrier",
              "image": "SummonerBarrier.png",
              "cooldown": [
                180
              ]
            }
          },
          {
            "hasCDR": false,
            "id": 133975,
            "champion": {
              "id": 83,
              "name": "Yorick",
              "image": "Yorick.png"
            },
            "spell1": {
              "id": 4,
              "name": "Flash",
              "image": "SummonerFlash.png",
              "cooldown": [
                300
              ]
            },
            "spell2": {
              "id": 14,
              "name": "Ignite",
              "image": "SummonerDot.png",
              "cooldown": [
                210
              ]
            }
          }
        ]
      }`);
}