import { Scenes } from 'telegraf';
import { User } from 'telegraf/typings/core/types/typegram';

export interface Context extends Scenes.SceneContext {}

export interface SceneState {
  user: User;
  subject: string;
  date: string;
  contact: {
    first_name: string;
    phone_number: string;
  };
}
