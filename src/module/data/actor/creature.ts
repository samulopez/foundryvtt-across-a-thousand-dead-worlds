import { sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

export const defineCreatureModel = () => ({
  // TODO
  ...sortingField(),
});

type CreatureModelSchema = ReturnType<typeof defineCreatureModel>;

export default class CreatureDataModel extends foundry.abstract.TypeDataModel<
  CreatureModelSchema,
  ATDWActor<'creature'>
> {
  static defineSchema(): CreatureModelSchema {
    return defineCreatureModel();
  }
}
