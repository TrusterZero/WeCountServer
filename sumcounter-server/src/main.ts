import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { RiotService } from 'services/riot.service'
import { HttpService } from '@nestjs/common';
import { ChampionDataService } from 'services/champion-data.service';
import { SpellDataService } from 'services/spell-data.service';

async function bootstrap() {
  const riot = new RiotService(
    new HttpService,
    new ChampionDataService,
    new SpellDataService);

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  
  riot.getMatch("Ryone").then((match)=>{
    console.log(JSON.stringify(match,null,2))
  })
 
}
bootstrap();
 