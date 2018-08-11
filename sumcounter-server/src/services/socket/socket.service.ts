import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ApiService } from '../api/api.service';
import { HttpService } from '@nestjs/common';
import { CooldownActivationData, CreationRequest, Payload, RequestError, RequestErrorCodes, SocketEvents } from './socket.interface';
import { Match } from '../../classes/match/match';
import { AxiosError } from '@nestjs/common/http/interfaces/axios.interfaces';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {

  @WebSocketServer() server;
  apiService = new ApiService(new HttpService());

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

    const data = payload.data as CreationRequest;

    this.apiService.getMatch(data.summonerId)
        .subscribe((match: Match) => {

          const roomId = match.id;
          client.join(`${roomId}`);

          this.server.to(client.id).emit(SocketEvents.matchCreated, match);
        }, error => {

            if (error.response) // misschien een betere  type check
            {
              this.handleAxiosError(client , error as AxiosError);
            }
            // beste manier om onverwachte errors te loggen
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

      switch (error.response.status) {

        case RequestErrorCodes.unauthorized:
          this.server.to(client.id).emit(SocketEvents.requestError,
                                        { status: RequestErrorCodes.unauthorized } as RequestError);
          break;

        case RequestErrorCodes.forbidden:
          this.server.to(client.id).emit(SocketEvents.requestError,
                                        { status: RequestErrorCodes.forbidden } as RequestError);
          break;

        case RequestErrorCodes.notFound:
          this.server.to(client.id).emit(SocketEvents.requestError,
                                        { status: RequestErrorCodes.notFound } as RequestError);
          break;

        default:
          this.server.to(client.id).emit(SocketEvents.requestError,
                                        { status: RequestErrorCodes.unhandled } as RequestError);
      }
  }
}