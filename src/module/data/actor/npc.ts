import { HIT_LOCATIONS } from '../../constants';

import { primaryAttributes, sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

const { ArrayField, DocumentUUIDField, NumberField, SchemaField, StringField } = foundry.data.fields;

export const defineNPCModel = () => ({
  primaryAttributes: primaryAttributes(),
  secondaryAttributes: new SchemaField({
    defense: new NumberField({ required: true, integer: true, min: 0, initial: 2 }),
    stress: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    wounds: new SchemaField({
      value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      max: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
    }),
  }),
  talents: new ArrayField(new StringField({ initial: '' }), { max: 5 }),
  details: new StringField({ initial: '' }),
  notes: new StringField({ initial: '' }),
  gear: new ArrayField(new DocumentUUIDField({ type: 'Item' })),
  hitLocation: new StringField({
    choices: [HIT_LOCATIONS.humanoid],
    initial: HIT_LOCATIONS.humanoid,
  }),
  ...sortingField(),
});

type NPCModelSchema = ReturnType<typeof defineNPCModel>;

export default class NPCDataModel extends foundry.abstract.TypeDataModel<NPCModelSchema, ATDWActor<'npc'>> {
  static defineSchema(): NPCModelSchema {
    return defineNPCModel();
  }
}
