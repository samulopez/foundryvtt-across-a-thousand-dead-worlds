import { defineItemModel } from './gear';

import type { GearModelSchema } from './gear';
import type ATDWItem from '../../item/item';

const { BooleanField, NumberField, SchemaField } = foundry.data.fields;

const defineArmorModel = () => ({
  armor: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  isFullBody: new BooleanField({ required: true, initial: false }),
  body: new SchemaField({
    head: new BooleanField({ initial: false }),
    back: new BooleanField({ initial: false }),
    torso: new BooleanField({ initial: false }),
    arms: new BooleanField({ initial: false }),
    hands: new BooleanField({ initial: false }),
    waist: new BooleanField({ initial: false }),
    legs: new BooleanField({ initial: false }),
    feet: new BooleanField({ initial: false }),
  }),
});

type ArmorModelSchema = ReturnType<typeof defineArmorModel> & GearModelSchema;

export default class ArmorDataModel extends foundry.abstract.TypeDataModel<ArmorModelSchema, ATDWItem<'armor'>> {
  static defineSchema(): ArmorModelSchema {
    return { ...defineItemModel(), ...defineArmorModel() };
  }

  slots(): number {
    return this.parent.system.gearSlots ?? 0;
  }
}
