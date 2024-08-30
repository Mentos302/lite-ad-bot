import { Module } from '@nestjs/common';
import { QuestionsScenes } from './scenes';
import { GoogleSheetsService } from 'src/services/google-sheets/google-sheets.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, GoogleSheetsService, ...QuestionsScenes],
})
export class QuestionsModule {}
