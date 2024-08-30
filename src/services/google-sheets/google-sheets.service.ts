const dayjs = require('dayjs');

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { group } from 'console';
import { SceneState } from 'src/interfaces/context.interface';

@Injectable()
export class GoogleSheetsService {
  private sheets: any;
  private sheetId: string;

  constructor(private configService: ConfigService) {
    this.sheetId = this.configService.get<string>('GOOGLE_SHEET_ID');
    this.setupGoogleSheetsAPI();
  }

  private setupGoogleSheetsAPI() {
    const keyPath = path.join(__dirname, '..', '..', '..', 'key.json');
    const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    jwtClient.authorize((err, tokens) => {
      if (err) {
        throw err;
      }
      this.sheets = google.sheets({ version: 'v4', auth: jwtClient });
    });
  }

  async getLastRowIndex(): Promise<number> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: this.configService.get<string>('GOOGLE_SHEET_NAME') + '!A:B',
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) return 0;

      const lastRowValue = rows[rows.length - 1][0];
      const lastIndex = parseInt(lastRowValue, 10);
      if (isNaN(lastIndex)) return 0;

      return lastIndex;
    } catch (error) {
      console.error('Error fetching last row index from Google Sheet:', error);
      return 0;
    }
  }

  async addToSheet({ contact, subject, date }: SceneState) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: this.configService.get<string>('GOOGLE_SHEET_NAME') + '!A:B',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [
            [
              dayjs().format('DD.MM.YYYY'),
              contact.first_name,
              contact.phone_number,
              '',
              subject !== 'other' ? subject : '',
              '',
              '',
              '',
              '',
              'Бот',
              'Лід',
              `${subject}, пробне цікавить на: ${date}`,
              '',
              '',
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error adding data to Google Sheet:', error);
    }
  }
}
