import {
  BACKGROUND,
  DRIVE,
  EARN_PLACE,
  LIFE_CHANGING_EVENT,
  MANNERISMS_BORED,
  MANNERISMS_CONFIDENT,
  MANNERISMS_FRUSTRATED,
  MANNERISMS_HAPPY,
  MANNERISMS_SHY,
  NERVOUS_TIC,
  TALENT,
  emotionalStates,
} from '../../constants';

import { primaryAttributes, skillField, sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

const { ArrayField, DocumentUUIDField, NumberField, SchemaField, StringField } = foundry.data.fields;

const defineCharacterModel = () => ({
  level: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),
  experience: new NumberField({ required: true, integer: true, min: 0, initial: 0, max: 1000 }),
  primaryAttributes: primaryAttributes(),
  secondaryAttributes: new SchemaField({
    luck: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
    stamina: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
    stress: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    wounds: new SchemaField({
      value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      max: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
    }),
  }),
  trauma: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  skills: new SchemaField({
    arsaidhTechnology: skillField(-5),
    closeCombat: skillField(0),
    perception: skillField(0),
    manipulation: skillField(0),
    medicalAid: skillField(0),
    pilot: skillField(0),
    rangedCombat: skillField(0),
    resolve: skillField(0),
    science: skillField(0),
    stealth: skillField(0),
    survival: skillField(0),
    technology: skillField(0),
  }),
  talent1: new StringField({
    choices: TALENT,
    initial: TALENT.none,
  }),
  talent2: new StringField({
    choices: TALENT,
    initial: TALENT.none,
  }),
  talent3: new StringField({
    choices: TALENT,
    initial: TALENT.none,
  }),
  talent4: new StringField({
    choices: TALENT,
    initial: TALENT.none,
  }),
  talent5: new StringField({
    choices: TALENT,
    initial: TALENT.none,
  }),
  personality: new SchemaField({
    background: new StringField({ choices: BACKGROUND, initial: BACKGROUND.none }),
    lifeChangingEvent: new StringField({ choices: LIFE_CHANGING_EVENT, initial: LIFE_CHANGING_EVENT.none }),
    howDidYouEarnYourPlace: new StringField({ choices: EARN_PLACE, initial: EARN_PLACE.none }),
    drive: new StringField({ choices: DRIVE, initial: DRIVE.none }),
    otherDetails: new StringField({ initial: '' }),
  }),
  mannerisms: new SchemaField({
    confident: new StringField({ choices: MANNERISMS_CONFIDENT, initial: MANNERISMS_CONFIDENT.none }),
    shy: new StringField({ choices: MANNERISMS_SHY, initial: MANNERISMS_SHY.none }),
    bored: new StringField({ choices: MANNERISMS_BORED, initial: MANNERISMS_BORED.none }),
    happy: new StringField({ choices: MANNERISMS_HAPPY, initial: MANNERISMS_HAPPY.none }),
    frustrated: new StringField({ choices: MANNERISMS_FRUSTRATED, initial: MANNERISMS_FRUSTRATED.none }),
  }),
  nervousTic: new StringField({
    choices: NERVOUS_TIC,
    initial: NERVOUS_TIC.none,
  }),
  drakeCoins: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  obsessionsAndNegativeTraits: new StringField({ initial: '' }),
  // TODO: is armor right?. It feels weird to have it as a single number when a character can wear different pieces of armor
  armor: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  rads: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  injuries: new StringField({ initial: '' }),
  emotion: new StringField({ required: true, choices: emotionalStates.map(({ value }) => `${value}`), initial: '0' }),
  gender: new StringField({ initial: '' }),
  age: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  details: new StringField({ initial: '' }),
  notes: new StringField({ initial: '' }),
  // TODO: armor: head, torso, waist, etc.? maybe only with gear is enough?
  // TODO: full body suit? maybe only with gear is enough?
  gear: new ArrayField(new DocumentUUIDField({ type: 'Item' })),
  maxBackpackSlots: new NumberField({ required: true, integer: true, min: 0, initial: 15 }),
  backpack: new ArrayField(new DocumentUUIDField({ type: 'Item' })),
  maxPocketsSlots: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
  pockets: new ArrayField(new DocumentUUIDField({ type: 'Item' })),
  ...sortingField(),
});

type CharacterModelSchema = ReturnType<typeof defineCharacterModel>;

type CharacterModelType = foundry.abstract.TypeDataModel<CharacterModelSchema, ATDWActor<'deepDiver'>>;

export default class CharacterDataModel extends foundry.abstract.TypeDataModel<
  CharacterModelSchema,
  ATDWActor<'deepDiver'>
> {
  static defineSchema(): CharacterModelSchema {
    return defineCharacterModel();
  }

  _preUpdate: CharacterModelType['_preUpdate'] = async (changed, options, user) => {
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
