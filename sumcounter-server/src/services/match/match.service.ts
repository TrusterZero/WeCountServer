import { Injectable } from '@nestjs/common';
import {Match} from "../../classes/match/match";
import {Summoner} from "../../classes/summoner/summoner";

@Injectable()
export class MatchService {
    activeMatches: Match[] = [];


    activate(match): Match{
        const activeMatch = this.getActiveMatchById(match.id);
        if(!activeMatch) {
            console.log(`match ${match.id} not found, activating it now`);
            // add match to active matches and return the new match
            return this.activeMatches[this.activeMatches.push(match)-1];
        } else {
            console.log(`match ${match.id} found`)
        }
        return activeMatch;
    }

    deactivate(match){
        console.log(`Deactivating match ${match.id}`);
        const matchIndex = this.activeMatches.indexOf(match);
        this.activeMatches.splice(matchIndex, 1)
    }

    addSummoner(newSummoner:Summoner, match: Match) {
        console.log(`Placing summoner ${newSummoner.name} in match ${match.id}`);
        const summoner = match.summoners.find((summoner) => summoner.id === newSummoner.id);
        summoner.active = true;
        match.activePlayers++;
    }

    getActiveMatchById(id: number): Match {
        console.log(`searching for match ${id}`);
        return this.activeMatches.find((activeMatch) => activeMatch.id === id);
    }

}
