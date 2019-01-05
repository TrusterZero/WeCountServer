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
const rxjs_1 = require("rxjs");
const match_service_1 = require("../match/match.service");
let EventsGateway = class EventsGateway {
    constructor(riotService, matchService) {
        this.riotService = riotService;
        this.matchService = matchService;
    }
    heartBeat(client) {
        rxjs_1.timer(5000).subscribe(() => {
            this.server.to(client.id).emit(socket_interface_1.SocketEvent.heartBeat, null);
        });
    }
    sumUsed(client, payload) {
        const match = this.matchService.getActiveMatchById(payload.roomId);
        const cooldownActivationData = payload.data;
        match.spellHistory.push(cooldownActivationData);
        this.server.to(payload.roomId)
            .emit(socket_interface_1.SocketEvent.sumUsed, cooldownActivationData);
    }
    createMatch(client, payload) {
        if (!payload.data) {
            this.errorHandler.invalidData(client);
            return;
        }
        this.checkSource(payload, client).then((checkedPayload) => {
            const creationRequest = checkedPayload.data;
            this.riotService.getMatch(creationRequest)
                .subscribe((match) => {
                if (match.summoners.length === 0) {
                    this.errorHandler.noSummoners(client);
                    return;
                }
                this.placeSummoner(payload.data.userName, match, client);
            }, (error) => this.errorHandler.matchNotFoundError(client, error));
        });
    }
    reconnectToMatch(client, payload) {
        const activeMatch = this.matchService.getActiveMatchById(payload.data.id);
        if (!activeMatch) {
            console.log('active match not found');
            this.server.to(client.id).emit(socket_interface_1.SocketEvent.joined, null);
            return;
        }
        const summoner = activeMatch.summoners.find((summoner) => summoner.name === payload.data.userName);
        summoner.clientId = client.id;
        this.addSummonerToMatch(summoner, activeMatch);
        this.renewSummonerList(activeMatch);
        this.server.to(client.id).emit(socket_interface_1.SocketEvent.joined, activeMatch);
    }
    placeSummoner(userName, match, client) {
        const summoner = match.summoners.find((summoner) => summoner.isRequester);
        summoner.isRequester = false;
        const activeMatch = this.matchService.activate(match);
        summoner.clientId = client.id;
        this.joinMatch(client, summoner, activeMatch);
    }
    joinMatch(client, summoner, match) {
        this.addSummonerToMatch(summoner, match);
        this.server.to(client.id)
            .emit(socket_interface_1.SocketEvent.matchCreated, match);
        this.renewSummonerList(match);
    }
    addSummonerToMatch(summoner, match) {
        this.matchService.addSummoner(summoner, match);
        this.server.sockets.connected[summoner.clientId].join(`${match.id}`);
    }
    spellHistory(client, payload) {
        const match = this.matchService.getActiveMatchById(payload.roomId);
        client.emit(socket_interface_1.SocketEvent.spellHistory, match.spellHistory);
    }
    leaveMatch(client, payload) {
        const { roomId, data } = payload;
        const match = this.matchService.getActiveMatchById(roomId);
        const summoner = match.summoners.find((summoner) => summoner.id === data.id);
        summoner.active = false;
        client.leave(roomId.toString());
        this.renewSummonerList(match);
        match.activePlayers--;
        if (match.activePlayers < 1) {
            this.matchService.deactivate(match);
        }
    }
    getActiveSummoners(client, payload) {
        const match = this.matchService.getActiveMatchById(payload.roomId);
        this.server.to(client.id)
            .emit(socket_interface_1.SocketEvent.activeSummoners, { summoners: match.summoners.filter((summoner) => summoner.active) });
    }
    renewSummonerList(match) {
        this.server.to(match.id)
            .emit(socket_interface_1.SocketEvent.activeSummoners, { summoners: match.summoners.filter((summoner) => summoner.active) });
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
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.heartBeat),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "heartBeat", null);
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
__decorate([
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.reconnectToMatch),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "reconnectToMatch", null);
__decorate([
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.getHistory),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "spellHistory", null);
__decorate([
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.leave),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "leaveMatch", null);
__decorate([
    websockets_1.SubscribeMessage(socket_interface_1.SocketEvent.getActiveSummoners),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "getActiveSummoners", null);
EventsGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [riot_service_1.RiotService, match_service_1.MatchService])
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=socket.service.js.map