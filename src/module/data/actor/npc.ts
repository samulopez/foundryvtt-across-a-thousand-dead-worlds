import { HIT_LOCATIONS, SORTING, TALENT_NPC } from '../../constants';

import { primaryAttributes, sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

const { NumberField, SchemaField, StringField } = foundry.data.fields;

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
  talent1: new StringField({
    choices: TALENT_NPC,
    initial: TALENT_NPC.none,
  }),
  talent2: new StringField({
    choices: TALENT_NPC,
    initial: TALENT_NPC.none,
  }),
  talent3: new StringField({
    choices: TALENT_NPC,
    initial: TALENT_NPC.none,
  }),
  talent4: new StringField({
    choices: TALENT_NPC,
    initial: TALENT_NPC.none,
  }),
  talent5: new StringField({
    choices: TALENT_NPC,
    initial: TALENT_NPC.none,
  }),
  hitLocation: new StringField({
    choices: [HIT_LOCATIONS.humanoid],
    initial: HIT_LOCATIONS.humanoid,
  }),
  description: new StringField({ initial: '' }),
  notes: new StringField({ initial: '' }),
  ...sortingField(),
});

type NPCModelSchema = ReturnType<typeof defineNPCModel>;

type NPCModelType = foundry.abstract.TypeDataModel<NPCModelSchema, ATDWActor<'npc'>>;

export default class NPCDataModel extends foundry.abstract.TypeDataModel<NPCModelSchema, ATDWActor<'npc'>> {
  static defineSchema(): NPCModelSchema {
    return defineNPCModel();
  }

  _preUpdate: NPCModelType['_preUpdate'] = async (changed, options, user) => {
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

  sortedItems(): Item.Implementation[] {
    if (this.parent.system.sorting === SORTING.alphabetically) {
      return this.parent.items.contents.sort((a, b) => a.name.localeCompare(b.name));
    }
    return this.parent.items.contents.sort((a, b) => a.sort - b.sort);
  }

  async toggleSorting() {
    const newSorting = this.parent.system.sorting === SORTING.manually ? SORTING.alphabetically : SORTING.manually;
    await this.parent.update({
      system: {
        sorting: newSorting,
      },
    });
  }
}
