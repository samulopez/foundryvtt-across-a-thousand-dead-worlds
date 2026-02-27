import { sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

export const defineMissionModel = () => ({
  // TODO
  ...sortingField(),
});

type MissionModelSchema = ReturnType<typeof defineMissionModel>;

export default class MissionDataModel extends foundry.abstract.TypeDataModel<MissionModelSchema, ATDWActor<'mission'>> {
  static defineSchema(): MissionModelSchema {
    return defineMissionModel();
  }
}
