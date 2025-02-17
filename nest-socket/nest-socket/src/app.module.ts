import { Module } from '@nestjs/common';
import { ChatGateway, RoomGateway } from './app.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway, RoomGateway],
})
export class AppModule {}
