import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {ApiService, isAxiosError} from '../api/api.service';
import {HttpService} from '@nestjs/common';
import {
    CooldownActivationData,
    CreationRequest,
    Payload,
    RequestError,
    RequestErrorCodes,
    SocketEvents, Source
} from './socket.interface';
import {Match} from '../../classes/match/match';
import {AxiosError} from '@nestjs/common/http/interfaces/axios.interfaces';
import {Socket} from 'socket.io';
import {RiotService} from '../riot.service';
import {SummonerResponse} from '../api/api.interface';

@WebSocketGateway()
export class EventsGateway {

    @WebSocketServer() server;
    riotService = new RiotService();

    /**
     *
     *  After receiving info about the spell that should be on cooldown
     *  Shares this information with everyone connected to the match
     *
     * @param client: The socket of user who emitted 'startCooldown'
     * @param data: info about the spell that should be on cooldown
     */
    @SubscribeMessage(SocketEvents.startCooldown)
    private sumUsed(client: Socket, payload: Payload) {
        console.log(payload)
        this.server.to(payload.roomId)
            .emit(SocketEvents.sumUsed, payload.data as CooldownActivationData);
    }

    /**
     *
     * Creates a room using the Id of the requested Match
     * Places the user in the created room and sends the user the requested Match
     *
     * @param client: The socket of user who emitted 'createMatch'
     * @param data: an Object containing the summonerId of the user
     */
    @SubscribeMessage(SocketEvents.createMatch)
    private createMatch(client: Socket, payload: Payload) {
        if (this.validatePayload(payload)) {
            client.emit(SocketEvents.requestError, {message: 'error in payload!'});
            return;
        }

        this.checkSource(payload).then((checkedPayload) => {
            const data = checkedPayload.data as CreationRequest;
            this.riotService.getMatch(data)
                .subscribe((match: Match) => this.placeSummoner(match, client),
                    (error) => isAxiosError(error) ? this.handleAxiosError(client, error) : '');
        });
    }

    /**
     *
     * Handles errors that are thrown during the REST requests
     *
     * @param client = client data was requested for
     * @param error
     */
    private handleAxiosError(client: Socket, error: AxiosError) {

        if (!error.response) {
            this.server.to(client.id).emit(SocketEvents.requestError, {status: RequestErrorCodes.unhandled});
            return false;
        }
        switch (error.response.status) {

            case RequestErrorCodes.unauthorized:
                this.server.to(client.id)
                    .emit(SocketEvents.requestError,
                        {status: RequestErrorCodes.unauthorized} as RequestError);
                break;

            case RequestErrorCodes.forbidden:
                this.server.to(client.id)
                    .emit(SocketEvents.requestError,
                        {status: RequestErrorCodes.forbidden} as RequestError);
                break;

            case RequestErrorCodes.notFound:
                this.server.to(client.id).emit(SocketEvents.requestError,
                    {status: RequestErrorCodes.notFound} as RequestError);
                break;

            default:
                this.server.to(client.id).emit(SocketEvents.requestError,
                    {status: RequestErrorCodes.unhandled} as RequestError);
        }
    }

    placeSummoner(match: Match, client: Socket) {
        const roomId = match.id;
        client.join(`${roomId}`);
        this.server.to(client.id).emit(SocketEvents.matchCreated, match);
    }

    validatePayload(payload: Payload) {
        return payload.data === null;
    }

    checkSource(payload: Payload): Promise<Payload> {
        return new Promise((resolve) => {
            if (payload.source !== Source.mobile) {
                resolve(payload);
            }
            this.riotService.getSummoner(payload.data.region, payload.data.summonerName)
                .subscribe((summonerResponse: SummonerResponse) => {
                    payload.data.summonerId = summonerResponse.id;
                    resolve(payload);
                });
        });
    }
}
