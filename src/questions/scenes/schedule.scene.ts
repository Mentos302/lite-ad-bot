import { Markup, Scenes } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, On, Ctx, Action, Message } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { SCENE_SETTINGS } from 'src/common/config/scene';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';

@Scene('question_schedule', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class QScheduleScene {
  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `🗓️ Коли Вам було б зручно відвідати <b>безкоштовне пробне заняття</b> з нашим репетитором?\n\n<i>Напишіть день та приблизні години.</i>`,
    );
  }

  @On('text')
  async onText(@Ctx() ctx: Context, @Message('text') date: string) {
    if (date && date.length < 6) {
      ctx.reply(
        `❌ Введена дата занадто коротка, спробуйте написати детальніше`,
      );

      return;
    }

    ctx.scene.enter('question_contact', { ...ctx.scene.state, date });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
