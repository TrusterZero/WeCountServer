import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { RiotService } from 'services/riot.service'
import { ChampionDataService } from 'services/champion-data.service';
import { SpellDataService } from 'services/spell-data.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

}
bootstrap();
 