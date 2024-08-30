import { Markup, Scenes } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Ctx, Action, Message } from 'nestjs-telegraf';
import { Context, SceneState } from 'src/interfaces/context.interface';
import { SCENE_SETTINGS } from 'src/common/config/scene';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Contact } from 'telegraf/typings/core/types/typegram';
import { GoogleSheetsService } from 'src/services/google-sheets/google-sheets.service';

@Scene('question_contact', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class QContactScene {
  constructor(private readonly sheetsService: GoogleSheetsService) {}

  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📞 Щоб ми могли зв'язатися з вами, поділіться, будь ласка, вашою контактною інформацією.\n\n<i>Ви також можете надіслати свій контакт напряму, натиснувши кнопку нижче.</i>`,
      Markup.keyboard([
        [{ text: '📞 Поділитися контактом', request_contact: true }],
      ]).resize(),
    );
  }

  @On(['contact', 'text'])
  async onContact(
    @Ctx() ctx: Context,
    @Message('contact') contact: Contact,
    @Message('text') text: string,
  ) {
    if (text && text.length < 10) {
      ctx.reply(
        `❌ Введений номер телефону занадто короткий. Будь ласка, введіть номер телефону, що містить щонайменше 10 цифр.`,
      );

      return;
    }

    await this.sheetsService.addToSheet({
      ...ctx.scene.state,
      contact: contact || {
        first_name: ctx.from.first_name,
        phone_number: text,
      },
    } as SceneState);

    ctx.replyWithHTML(
      `✅ Дякуємо! Ми отримали ваш запит на пробне заняття.\n\n<i>Наш менеджер зв'яжеться з вами для підтвердження деталей.</i>`,
      Markup.inlineKeyboard([
        [{ text: 'Інформація про нас', callback_data: 'rndmsht' }],
      ]),
    );

    ctx.scene.leave();
  }
}
