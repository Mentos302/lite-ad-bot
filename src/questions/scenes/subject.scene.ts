import { Markup, Scenes } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { Scene, SceneEnter, Action, Ctx, On } from 'nestjs-telegraf';
import { Context, SceneState } from 'src/interfaces/context.interface';
import { SCENE_SETTINGS } from 'src/common/config/scene';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';

@Scene('question_subject', SCENE_SETTINGS)
@UseFilters(TelegrafExceptionFilter)
export class QSubjectScene {
  constructor() {}

  @SceneEnter()
  onSceneEnter(ctx: Context) {
    ctx.replyWithHTML(
      `📚 Репетитор з якого предмету вас цікавить?`,
      Markup.inlineKeyboard([
        [{ text: '📖 Українська мова', callback_data: 'ukr' }],
        [{ text: '🇬🇧 Англійська мова', callback_data: 'eng' }],
        [{ text: '🔢 Математика', callback_data: 'math' }],
        [{ text: '🔍 Інший предмет', callback_data: 'other' }],
      ]),
    );
  }

  @Action('ukr')
  async onUkrAction(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    ctx.scene.enter('question_schedule', {
      ...ctx.scene.state,
      subject: 'Українська',
    });
  }

  @Action('eng')
  async onEngAction(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    ctx.scene.enter('question_schedule', {
      ...ctx.scene.state,
      subject: 'Англійська',
    });
  }

  @Action('math')
  async onMathAction(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    ctx.scene.enter('question_schedule', {
      ...ctx.scene.state,
      subject: 'Математика',
    });
  }

  @Action('other')
  async onOtherAction(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();

    ctx.scene.enter('question_schedule', {
      ...ctx.scene.state,
      subject: 'other',
    });
  }

  @On('message')
  async onMessage(ctx: Context): Promise<void> {
    ctx.scene.reenter();
  }
}
