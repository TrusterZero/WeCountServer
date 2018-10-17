/**
 *
 * Handles errors that are thrown during the REST requests
 *
 * @param client = client data was requested for
 * @param error
 */
import {Server, Socket} from 'socket.io';
import {AxiosError} from '@nestjs/common/http/interfaces/axios.interfaces';
import {ErrorCode, RequestError, RequestErrorMessage, SocketEvent} from './socket.interface';

export class SocketErrorHandler {

   private server: Server;

    constructor(server: Server) {
        this.server = server;
    }

    handle(client: Socket, error: AxiosError) {

        if (!error.response) {
            this.notify(client, {status: ErrorCode.unhandled, message: RequestErrorMessage.generic});
            return false;
        }
        switch (error.response.status) {

            case ErrorCode.unauthorized:
                this.notify(client,
                        {
                            status: ErrorCode.unauthorized,
                            message: RequestErrorMessage.generic
                        } as RequestError);
                break;

            case ErrorCode.forbidden:
                this.notify(client,
                        {
                            status: ErrorCode.forbidden,
                            message: RequestErrorMessage.generic
                        } as RequestError);
                break;

            case ErrorCode.notFound:
                this.notify(client,
                    {
                        status: ErrorCode.notFound,
                        message: RequestErrorMessage.generic
                    } as RequestError);
                break;

            default:
                this.notify(client,
                    {
                        status: ErrorCode.unhandled,
                        message: RequestErrorMessage.generic
                    } as RequestError);
        }
    }

    summonerNotFoundError(client: Socket, error: AxiosError) {
        if (!error.response) {
            console.log(error)
            this.handle(client, error);
        }
        error.response.status === ErrorCode.notFound ?
            this.notify(client, {
                status: ErrorCode.summonerNotfound,
                message: RequestErrorMessage.summonerNotFound,
            }) :
            this.handle(client, error);
    }

    noSummoners(client){
        this.notify(client, {status: ErrorCode.noSummoners, message: RequestErrorMessage.noSummoners});
    }

    matchNotFoundError(client: Socket, error: AxiosError) {
        if (!error.response) {
            console.log(error)
            this.handle(client, error);
        }
        error.response.status === ErrorCode.notFound ?
            this.notify(client, {
                status: ErrorCode.matchNotFound,
                message: RequestErrorMessage.matchNotFound,
            }) :
            this.handle(client, error);
    }

    invalidData(client: Socket) {
        this.notify(client, {status: ErrorCode.unhandled, message: RequestErrorMessage.invalidData} );
    }

    wrongGameModeError(client: Socket) {
        this.notify(client, {
            status: ErrorCode.wrongGameMode,
            message: RequestErrorMessage.wrongGameMode
        });
    }

    private notify(client: Socket, message: RequestError){
        this.server.to(client.id).emit(SocketEvent.requestError, message);
    }
}
