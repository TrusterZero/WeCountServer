import {OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {isAxiosError} from '../api/api.service';
import {
    CooldownActivationData,
    CreationRequest,
    Payload,
    ErrorCode,
    SocketEvent,
    Source,
} from './socket.interface';
import {Match} from '../../classes/match/match';
import {Server, Socket} from 'socket.io';
import {RiotService} from '../riot.service';
import {SummonerResponse} from '../api/api.interface';
import {SocketErrorHandler} from './socket-error-handler';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit{

    @WebSocketServer() server;
    errorHandler: SocketErrorHandler;

    constructor(private riotService: RiotService) { }

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
        this.server.to(payload.roomId)
            .emit(SocketEvent.sumUsed, payload.data as CooldownActivationData);
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
            this.errorHandler.invalidData(client)
            return;
        }
        this.checkSource(payload, client).then((checkedPayload) => {
            const data = checkedPayload.data as CreationRequest;
            this.riotService.getMatch(data)
                .subscribe((match: Match) => this.placeSummoner(match, client),
                    (error) => this.errorHandler.matchNotFoundError(client, error));
        });
    }

    /**
     *
     * @param match
     * @param client
     */
    private placeSummoner(match: Match, client: Socket) {
        if (match.summoners.length === 0){
            this.errorHandler.noSummoners(client);
            return;
        }
        const roomId = match.id;
        client.join(`${roomId}`);
        this.server.to(client.id).emit(SocketEvent.matchCreated, match);
    }

    private checkSource(payload: Payload, client: Socket): Promise<Payload> {
        return new Promise((resolve) => {
            if (payload.source !== Source.mobile) {
                resolve(payload);
            }
            this.riotService.getSummoner(payload.data.region, payload.data.summonerName)
                .subscribe((summonerResponse: SummonerResponse) => {
                    payload.data.summonerId = summonerResponse.id;
                    resolve(payload);
                }, (error) => this.errorHandler.summonerNotFoundError(client, error));
        });
    }

    afterInit(server: Server): any {
        this.errorHandler = new SocketErrorHandler(server);
    }
}
