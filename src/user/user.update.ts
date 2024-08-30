import { Markup } from 'telegraf';
import { On, Update, Ctx } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Injectable, UseFilters } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';

@Update()
@UseFilters(TelegrafExceptionFilter)
@Injectable()
export class UserUpdate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @On(['message', 'callback_query'])
  async onMessage(@Ctx() ctx: Context): Promise<void> {
    if (ctx.updateType === 'callback_query') await ctx.answerCbQuery();

    const user = await this.userModel.findOne({ chat_id: ctx.from.id });

    if (user) {
      ctx.replyWithHTML(
        `👋 <b>Вітаємо в ЛАЙТ!</b>\n\n` +
          `Допомагаємо покращити оцінки та готуємо до НМТ/ЗНО. Підберемо найкращого репетитора для ефективного навчання.\n\n` +
          `📍 <b>Навчання онлайн та у Львові, вул. Плугова 2.</b>\n\n` +
          `🎓 <b>Наші переваги:</b> зручний графік занять, кваліфіковані викладачі, можливість навчання наживо, зручна комунікація через Telegram.\n\n` +
          `🖥 <b>Наш веб-сайт:</b> <a href="lite.place">www.lite.place</a>\n` +
          `📞 <b>Контакти:</b> +380962144665\n`,
        Markup.inlineKeyboard([
          { text: '💬 Написати менеджеру', url: 'https://t.me/lite_education' },
        ]),
      );
    } else {
      await this.userModel.create({ chat_id: ctx.from.id });

      ctx.scene.enter('question_subject');
    }
  }
}
