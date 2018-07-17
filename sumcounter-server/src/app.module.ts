import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiotService } from './riot.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RiotService],
})
export class AppModule {}
