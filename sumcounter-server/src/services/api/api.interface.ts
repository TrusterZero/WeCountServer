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
    summonerId: string;
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
    puuId: string;
    accountId: string;
    id: number;
    name: string;
    profileIconId: number;
    revisionDate: number;
    level: number;
}

export interface RawChampionCollection {
    type: string,
    format: string,
    version: string,
    data: RawChampionData[]
}

export interface RawChampionData {
    version: string,
    id: string,
    key: string,
    name: string,
    title: string,
    blurb:
        string,
    info: RawChampionInfo,
    image: RawChampionImage,
    tags: string[],
    partype: string,
    stats: RawChampionStats,
        
}

export interface RawChampionInfo {
    attack: number,
    defense: number,
    magic: number,
    difficulty: number
}

interface RawChampionImage {
    full: string,
    sprite: string,
    group: string,
    x: number,
    y: number,
    w: number,
    h: number,
}

interface RawChampionStats {
    hp: number,
    hpperlevel: number,
    mp: number,
    mpperlevel: number,
    movespeed: number,
    armor: number,
    armorperlevel: number,
    spellblock: number,
    spellblockperlevel: number,
    attackrange: number,
    hpregen: number,
    hpregenperlevel: number,
    mpregen: number,
    mpregenperlevel: number,
    crit: number,
    critperlevel: number,
    attackdamage: number,
    attackdamageperlevel: number,
    attackspeedperlevel: number,
    attackspeed: number
}


