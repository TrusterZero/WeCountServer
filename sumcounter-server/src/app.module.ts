import { Module, HttpModule } from '@nestjs/common';
import { AppController } from 'app.controller';
import { PROVIDERS } from 'app-module/providers';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [...PROVIDERS],
})
export class AppModule {}
