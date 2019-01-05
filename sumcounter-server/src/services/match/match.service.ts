import { Injectable } from '@nestjs/common';
import {Match} from "../../classes/match/match";
import {Summoner} from "../../classes/summoner/summoner";

@Injectable()
export class MatchService {
    activeMatches: Match[] = [];


    activate(match): Match{
        const activeMatch = this.getActiveMatchById(match.id);
        if(!activeMatch) {
            return this.activeMatches[this.activeMatches.push(match)-1];
        }
        return activeMatch;
    }

    deactivate(match){
        const matchIndex = this.activeMatches.indexOf(match);
        this.activeMatches.splice(matchIndex, 1)
    }

    addSummoner(newSummoner:Summoner, match: Match) {
        const summoner = match.summoners.find((summoner) => summoner.id === newSummoner.id);
        summoner.active = true;
        match.activePlayers++;
    }

    getActiveMatchById(id: number): Match {
        return this.activeMatches.find((activeMatch) => activeMatch.id === id);
    }

}
