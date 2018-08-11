export interface MatchResponse {
    gameId: number;
    gameStartTime: number;
    platformId: string;
    gameMode: string;
    mapId: number;
    gameType: string;
    bannedChampions: BannedChampion[];
    observers: Observer;
    participants: CurrentGameParticipant[];
    gameLength: number;
    gameQueueConfigId: number;
}

export interface BannedChampion {
    pickTurn: number;
    championId: number;
    teamId: number;
}

export interface Observer {
    encryptionKey: string;
}

export interface CurrentGameParticipant {
    profileIcon: number;
    championId: number;
    summonerName: string;
    gameCustomizationObjects: GameCustomizationObject[];
    bot: boolean;
    perks: Perks;
    spell1Id: number;
    spell2Id: number;
    teamId: number;
    summonerId: number;    
}

export interface GameCustomizationObject {
    category: string;
    content: string;
}

export interface Perks {
    perkStyle: number;
    perkIds: number[];
    perkSubStyle: number[];
}

export interface SummonerResponse {
    id: number;
    name: string;
    profileIconId: number;
    revisionDate: number;
    level: number;
}