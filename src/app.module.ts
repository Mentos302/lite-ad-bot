import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { UsersModule } from './user/user.module';
import { GoogleSheetsService } from './services/google-sheets/google-sheets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsModule } from './questions/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
    }),
    UsersModule,
    QuestionsModule,
  ],
  providers: [GoogleSheetsService],
})
export class AppModule {}
