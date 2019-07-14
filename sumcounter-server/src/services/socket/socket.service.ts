import {OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {
    CooldownActivationData,
    CreationRequest,
    Payload,
    SocketEvent,
    Source,
} from './socket.interface';
import {Match} from '../../classes/match/match';
import {Server, Socket} from 'socket.io';
import {RiotService} from '../riot.service';
import {SummonerResponse} from '../api/api.interface';
import {SocketErrorHandler} from './socket-error-handler';
import {Summoner} from "../../classes/summoner/summoner";
import {timer} from "rxjs";
import {MatchService} from "../match/match.service";

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit{



    @WebSocketServer() server;
    errorHandler: SocketErrorHandler;

    constructor(private riotService: RiotService, private matchService: MatchService) { }

    @SubscribeMessage(SocketEvent.heartBeat)
    heartBeat(client: Socket){
        timer(5000).subscribe(() => {
            this.server.to(client.id).emit(SocketEvent.heartBeat, null)
        })
    }

    /**
     *
     *  After receiving info about the spell that should be on cooldown
     *  Shares this information with everyone connected to the match
     *
     * @param client: The socket of user who emitted 'startCooldown'
     * @param data: info about the spell that should be on cooldown
     */
    @SubscribeMessage(SocketEvent.startCooldown)
    private sumUsed(client: Socket, payload: Payload) {
        const match = this.matchService.getActiveMatchById(payload.roomId);
        const cooldownActivationData: CooldownActivationData = payload.data;

        match.spellHistory.push(cooldownActivationData);
        this.server.to(payload.roomId)
            .emit(SocketEvent.sumUsed, cooldownActivationData);
    }

    /**
     *
     * Creates a room using the Id of the requested Match
     * Places the user in the created room and sends the user the requested Match
     *
     * @param client: The socket of user who emitted 'createMatch'
     * @param payload
     */
    @SubscribeMessage(SocketEvent.createMatch)
    private createMatch(client: Socket, payload: Payload) {
        if (!payload.data) {
            this.errorHandler.invalidData(client);
            return;
        }



        this.checkSource(payload, client).then((checkedPayload) => {

            const creationRequest = checkedPayload.data as CreationRequest;
            this.riotService.getMatch(creationRequest)
                .subscribe((match: Match) => {
                 if (match.summoners.length === 0){
                     this.errorHandler.noSummoners(client);
                     return;
                 }
                 this.placeSummoner(payload.data.userName,match, client);
                },(error) => this.errorHandler.matchNotFoundError(client, error));
        });
    }

    @SubscribeMessage(SocketEvent.reconnectToMatch)
    private reconnectToMatch(client: Socket, payload: Payload){
        const activeMatch: Match = this.matchService.getActiveMatchById(payload.data.id);
        if(!activeMatch){
            // tell the user there is no match to reconnect to
            this.server.to(client.id).emit(SocketEvent.joined, null);
            return;
        }
        const summoner = activeMatch.summoners.find((summoner:Summoner) =>
            summoner.name === payload.data.userName);

        summoner.clientId = client.id;

        this.addSummonerToMatch(summoner, activeMatch);
        this.renewSummonerList(activeMatch);
        this.server.to(client.id).emit(SocketEvent.joined, activeMatch)
    }

    /**
     *
     * @param userName
     * @param match
     * @param client
     */
    private placeSummoner(userName: string, match: Match, client: Socket, ) {
        const summoner = match.summoners.find((summoner:Summoner) =>
            summoner.isRequester);
        summoner.isRequester = false;

        const activeMatch: Match = this.matchService.activate(match);

        summoner.clientId = client.id;

        this.joinMatch(client, summoner, activeMatch);
    }

    private joinMatch(client: Socket,summoner: Summoner,match: Match) {
        this.addSummonerToMatch(summoner,match);
        this.server.to(client.id)
            .emit(SocketEvent.matchCreated, match);
        this.renewSummonerList(match);

    }

    private addSummonerToMatch(summoner, match) {
        this.matchService.addSummoner(summoner, match);
        this.server.sockets.connected[summoner.clientId].join(`${match.id}`);
    }

    @SubscribeMessage(SocketEvent.getHistory)
    private spellHistory(client: Socket, payload: Payload) {
        const match = this.matchService.getActiveMatchById(payload.roomId);
        client.emit(SocketEvent.spellHistory, match.spellHistory);
    }

    @SubscribeMessage(SocketEvent.leave)
    private leaveMatch(client: Socket, payload: Payload):void {
        const {roomId, data} = payload;
        const match: Match = this.matchService.getActiveMatchById(roomId);
        const summoner: Summoner = match.summoners.find((summoner) => summoner.id === data.id);

        summoner.active = false;
        client.leave(roomId.toString());

        this.renewSummonerList(match);

        match.activePlayers--;
        if (match.activePlayers < 1) {
            this.matchService.deactivate(match);
        }
    }

    @SubscribeMessage(SocketEvent.getActiveSummoners)
    private getActiveSummoners(client, payload) {
        const match = this.matchService.getActiveMatchById(payload.roomId);
        this.server.to(client.id)
            .emit(SocketEvent.activeSummoners, {summoners :match.summoners.filter((summoner) => summoner.active)});
    }

    private renewSummonerList(match: Match): void {
        this.server.to(match.id)
            .emit(SocketEvent.activeSummoners, {summoners :match.summoners.filter((summoner) => summoner.active)});
    }

    private checkSource(payload: Payload, client: Socket): Promise<Payload> {
        return new Promise((resolve) => {
            if (payload.source !== Source.mobile) {
                resolve(payload);
            }
            this.riotService.getSummoner(payload.data.region, payload.data.summonerName)
                .subscribe((summonerResponse: SummonerResponse) => {
                    payload.data.summonerId = summonerResponse.id;
                    payload.data.accountId = summonerResponse.accountId;
                    resolve(payload);
                }, (error) => {console.log(error); this.errorHandler.summonerNotFoundError(client, error, payload)});
        });
    }

    afterInit(server: Server): any {
        this.errorHandler = new SocketErrorHandler(server);
    }
}
