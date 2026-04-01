import { HIT_LOCATIONS } from '../../constants';

import { sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

const { StringField } = foundry.data.fields;

export const defineCreatureModel = () => ({
  // TODO
  hitLocation: new StringField({
    choices: [HIT_LOCATIONS.none, HIT_LOCATIONS.humanoid, HIT_LOCATIONS.quadruped, HIT_LOCATIONS.serpentine],
    initial: HIT_LOCATIONS.none,
  }),
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
