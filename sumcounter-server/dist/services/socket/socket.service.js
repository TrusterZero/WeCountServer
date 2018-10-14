"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_1 = require("@nestjs/websockets");
const socket_interface_1 = require("./socket.interface");
const riot_service_1 = require("../riot.service");
const socket_error_handler_1 = require("./socket-error-handler");
let EventsGateway = class EventsGateway {
    constructor(riotService) {
        this.riotService = riotService;
    }
    sumUsed(client, payload) {
        this.server.to(payload.roomId)
            .emit(socket_interface_1.SocketEvent.sumUsed, payload.data);
    }
    createMatch(client, payload) {
        if (!payload.data) {
            this.errorHandler.invalidData(client);
            return;
        }
        this.checkSource(payload, client).then((checkedPayload) => {
            const data = checkedPayload.data;
            this.riotService.getMatch(data)
                .subscribe((match) => this.placeSummoner(match, client), (error) => this.errorHandler.matchNotFoundError(client, error));
        });
    }
    placeSummoner(match, client) {
        if (match.summoners.length === 0) {
            this.errorHandler.noSummoners(client);
            return;
        }
        const roomId = match.id;
        client.join(`${roomId}`);
        this.server.to(client.id).emit(socket_interface_1.SocketEvent.matchCreated, match);
    }
    checkSource(payload, client) {
        return new Promise((resolve) => {
            if (payload.source !== socket_interface_1.Source.mobile) {
                resolve(payload);
            }
            this.riotService.getSummoner(payload.data.region, payload.data.summonerName)
                .subscribe((summonerResponse) => {
                payload.data.summonerId = summonerResponse.id;
                resolve(payload);
            }, (error) => this.errorHandler.summonerNotFoundError(client, error));
        });
    }
    afterInit(server) {
        this.errorHandler = new socket_error_handler_1.SocketErrorHandler(server);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], EventsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.startCooldown),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "sumUsed", null);
__decorate([
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.createMatch),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "createMatch", null);
EventsGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [riot_service_1.RiotService])
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=socket.service.js.map