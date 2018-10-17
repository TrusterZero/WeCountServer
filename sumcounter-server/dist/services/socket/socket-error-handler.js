"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_interface_1 = require("./socket.interface");
class SocketErrorHandler {
    constructor(server) {
        this.server = server;
    }
    handle(client, error) {
        if (!error.response) {
            this.notify(client, { status: socket_interface_1.ErrorCode.unhandled, message: socket_interface_1.RequestErrorMessage.generic });
            return false;
        }
        switch (error.response.status) {
            case socket_interface_1.ErrorCode.unauthorized:
                this.notify(client, {
                    status: socket_interface_1.ErrorCode.unauthorized,
                    message: socket_interface_1.RequestErrorMessage.generic
                });
                break;
            case socket_interface_1.ErrorCode.forbidden:
                this.notify(client, {
                    status: socket_interface_1.ErrorCode.forbidden,
                    message: socket_interface_1.RequestErrorMessage.generic
                });
                break;
            case socket_interface_1.ErrorCode.notFound:
                this.notify(client, {
                    status: socket_interface_1.ErrorCode.notFound,
                    message: socket_interface_1.RequestErrorMessage.generic
                });
                break;
            default:
                this.notify(client, {
                    status: socket_interface_1.ErrorCode.unhandled,
                    message: socket_interface_1.RequestErrorMessage.generic
                });
        }
    }
    summonerNotFoundError(client, error) {
        if (!error.response) {
            console.log(error);
            this.handle(client, error);
        }
        error.response.status === socket_interface_1.ErrorCode.notFound ?
            this.notify(client, {
                status: socket_interface_1.ErrorCode.summonerNotfound,
                message: socket_interface_1.RequestErrorMessage.summonerNotFound,
            }) :
            this.handle(client, error);
    }
    noSummoners(client) {
        this.notify(client, { status: socket_interface_1.ErrorCode.noSummoners, message: socket_interface_1.RequestErrorMessage.noSummoners });
    }
    matchNotFoundError(client, error) {
        if (!error.response) {
            console.log(error);
            this.handle(client, error);
        }
        error.response.status === socket_interface_1.ErrorCode.notFound ?
            this.notify(client, {
                status: socket_interface_1.ErrorCode.matchNotFound,
                message: socket_interface_1.RequestErrorMessage.matchNotFound,
            }) :
            this.handle(client, error);
    }
    invalidData(client) {
        this.notify(client, { status: socket_interface_1.ErrorCode.unhandled, message: socket_interface_1.RequestErrorMessage.invalidData });
    }
    wrongGameModeError(client) {
        this.notify(client, {
            status: socket_interface_1.ErrorCode.wrongGameMode,
            message: socket_interface_1.RequestErrorMessage.wrongGameMode
        });
    }
    notify(client, message) {
        this.server.to(client.id).emit(socket_interface_1.SocketEvent.requestError, message);
    }
}
exports.SocketErrorHandler = SocketErrorHandler;
//# sourceMappingURL=socket-error-handler.js.map