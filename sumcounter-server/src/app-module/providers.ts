import { AppService } from './app.service';
import { RiotService } from '../services/riot.service';
import { ChampionDataService } from '../services/champion-data.service';
import { SpellDataService } from '../services/spell-data.service';
import { EventsGateway } from '../services/socket/socket.service';
import { ApiService } from '../services/api/api.service';


export const PROVIDERS = [
    AppService,
    ApiService,
    RiotService,
    ChampionDataService,
    SpellDataService,
    EventsGateway,
];
