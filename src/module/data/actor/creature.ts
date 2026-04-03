import {
  CREATURE_DRIVE,
  CREATURE_INTELLIGENCE,
  CREATURE_ROLE,
  CREATURE_SIZE,
  CREATURE_TYPE,
  HIT_LOCATIONS,
} from '../../constants';

import { primaryAttributes, skillField, sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

const { ArrayField, BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

export const defineCreatureModel = () => ({
  primaryAttributes: primaryAttributes(),
  type: new StringField({ choices: CREATURE_TYPE, initial: CREATURE_TYPE.none }),
  size: new StringField({ choices: CREATURE_SIZE, initial: CREATURE_SIZE.none }),
  drive: new StringField({ choices: CREATURE_DRIVE, initial: CREATURE_DRIVE.none }),
  intelligence: new StringField({ choices: CREATURE_INTELLIGENCE, initial: CREATURE_INTELLIGENCE.none }),
  role: new StringField({ choices: CREATURE_ROLE, initial: CREATURE_ROLE.none }),
  movement: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  hitLocation: new StringField({
    choices: HIT_LOCATIONS,
    initial: HIT_LOCATIONS.none,
  }),
  wounds: new SchemaField({
    value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    max: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
  }),
  // TODO: add roll
  awareness: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  armor: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  defense: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  range: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  // TODO: add roll
  attackSkill: skillField(0),
  // TODO: add roll?
  damage: new StringField({ initial: '' }),
  // TODO: add roll
  abilities: new ArrayField(
    new SchemaField({
      isPassive: new BooleanField({ initial: false }),
      name: new StringField({ initial: '', required: true }),
      description: new StringField({ initial: '', required: true }),
    }),
  ),
  description: new StringField({ initial: '' }),
  notes: new StringField({ initial: '' }),
  ...sortingField(),
});

type CreatureModelSchema = ReturnType<typeof defineCreatureModel>;

type CreatureModelType = foundry.abstract.TypeDataModel<CreatureModelSchema, ATDWActor<'creature'>>;

export default class CreatureDataModel extends foundry.abstract.TypeDataModel<
  CreatureModelSchema,
  ATDWActor<'creature'>
> {
  static defineSchema(): CreatureModelSchema {
    return defineCreatureModel();
  }

  _preUpdate: CreatureModelType['_preUpdate'] = async (changed, options, user) => {
    if (
      changed.name !== undefined &&
      this.parent.name !== changed.name &&
      this.parent.prototypeToken.name !== changed.name &&
      changed.prototypeToken !== undefined
    ) {
      // eslint-disable-next-line no-param-reassign
      changed.prototypeToken.name = changed.name;
    }
    return super._preUpdate(changed, options, user);
  };
}
