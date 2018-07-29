import { AppService } from "app.service";
import { RiotService } from "services/riot.service";
import { ChampionDataService } from "services/champion-data.service";
import { SpellDataService } from "services/spell-data.service";
import { EventsGateway } from "services/socket.service";

export const PROVIDERS = [
    AppService,
    RiotService,
    ChampionDataService,
    SpellDataService,
    EventsGateway
];
