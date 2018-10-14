"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["startCooldown"] = "startCooldown";
    SocketEvent["createMatch"] = "createMatch";
    SocketEvent["matchCreated"] = "matchCreated";
    SocketEvent["sumUsed"] = "sumUsed";
    SocketEvent["requestError"] = "requestError";
    SocketEvent["connectionError"] = "connect_error";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
var Source;
(function (Source) {
    Source[Source["pc"] = 0] = "pc";
    Source[Source["mobile"] = 1] = "mobile";
})(Source = exports.Source || (exports.Source = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["notFound"] = 404] = "notFound";
    ErrorCode[ErrorCode["matchNotFound"] = 4041] = "matchNotFound";
    ErrorCode[ErrorCode["summonerNotfound"] = 4042] = "summonerNotfound";
    ErrorCode[ErrorCode["forbidden"] = 403] = "forbidden";
    ErrorCode[ErrorCode["unauthorized"] = 401] = "unauthorized";
    ErrorCode[ErrorCode["rateLimitExceeded"] = 429] = "rateLimitExceeded";
    ErrorCode[ErrorCode["unhandled"] = 0] = "unhandled";
    ErrorCode[ErrorCode["noSummoners"] = 1] = "noSummoners";
    ErrorCode[ErrorCode["wrongGameMode"] = 2] = "wrongGameMode";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var RequestErrorMessage;
(function (RequestErrorMessage) {
    RequestErrorMessage["summonerNotFound"] = "Can't find your summonername, please re-login";
    RequestErrorMessage["matchNotFound"] = "Wait until the loading screen pops up, then we will be ready";
    RequestErrorMessage["wrongGameMode"] = "We Count can't be used in this gamemode";
    RequestErrorMessage["noSummoners"] = "No enemies found in this match";
    RequestErrorMessage["invalidData"] = "Something is wrong with the data!";
    RequestErrorMessage["generic"] = "Error occured please try again later";
})(RequestErrorMessage = exports.RequestErrorMessage || (exports.RequestErrorMessage = {}));
//# sourceMappingURL=socket.interface.js.map