import {
  CREATURE_COVERED_WITH,
  CREATURE_DRIVE,
  CREATURE_EYES_NUMBER,
  CREATURE_EYES_TYPE,
  CREATURE_FORE_LIMBS,
  CREATURE_GENERAL_APPEARANCE,
  CREATURE_HIND_LIMBS,
  CREATURE_INTELLIGENCE,
  CREATURE_LIMBS_AQUATIC,
  CREATURE_MOUTH,
  CREATURE_NUMBER_LIMBS,
  CREATURE_ROLE,
  CREATURE_SIZE,
  CREATURE_TYPE,
  CREATURE_UNIQUE_FEATURE,
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
  awareness: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  armor: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  defense: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  range: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  attackSkill: skillField(0),
  damage: new StringField({ initial: '' }),
  abilities: new ArrayField(
    new SchemaField({
      isPassive: new BooleanField({ initial: false }),
      name: new StringField({ initial: '', required: true }),
      description: new StringField({ initial: '', required: true }),
    }),
  ),
  appearance: new SchemaField({
    general: new StringField({ choices: CREATURE_GENERAL_APPEARANCE, initial: CREATURE_GENERAL_APPEARANCE.none }),
    coveredWith: new StringField({ choices: CREATURE_COVERED_WITH, initial: CREATURE_COVERED_WITH.none }),
    uniqueFeature: new StringField({ choices: CREATURE_UNIQUE_FEATURE, initial: CREATURE_UNIQUE_FEATURE.none }),
    numberLimbs: new StringField({ choices: CREATURE_NUMBER_LIMBS, initial: CREATURE_NUMBER_LIMBS.none }),
    limbsAquatic: new StringField({ choices: CREATURE_LIMBS_AQUATIC, initial: CREATURE_LIMBS_AQUATIC.none }),
    foreLimbs: new StringField({ choices: CREATURE_FORE_LIMBS, initial: CREATURE_FORE_LIMBS.none }),
    hindLimbs: new StringField({ choices: CREATURE_HIND_LIMBS, initial: CREATURE_HIND_LIMBS.none }),
    mouth: new StringField({ choices: CREATURE_MOUTH, initial: CREATURE_MOUTH.none }),
    eyesType: new StringField({ choices: CREATURE_EYES_TYPE, initial: CREATURE_EYES_TYPE.none }),
    eyesNumber: new StringField({ choices: CREATURE_EYES_NUMBER, initial: CREATURE_EYES_NUMBER.none }),
  }),
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

  async addAbility() {
    const abilities = this.parent.system.abilities.slice();
    abilities.push({ name: 'New Ability', description: '', isPassive: false });
    await this.parent.update({ system: { abilities } });
  }

  async deleteAbility(abilityIndex: number) {
    const abilities = this.parent.system.abilities.slice();
    abilities.splice(abilityIndex, 1);
    await this.parent.update({ system: { abilities } });
  }
}
