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

type ArmorDataModelType = foundry.abstract.TypeDataModel<ArmorModelSchema, ATDWItem<'armor'>>;

export default class ArmorDataModel extends foundry.abstract.TypeDataModel<ArmorModelSchema, ATDWItem<'armor'>> {
  static defineSchema(): ArmorModelSchema {
    return { ...defineItemModel(), ...defineArmorModel() };
  }

  _preUpdate: ArmorDataModelType['_preUpdate'] = async (changed, options, user) => {
    if (changed.system?.isFullBody === true) {
      // eslint-disable-next-line no-param-reassign
      changed.system.body = {
        head: false,
        back: false,
        torso: false,
        arms: false,
        hands: false,
        waist: false,
        legs: false,
        feet: false,
      };
    }
    return super._preUpdate(changed, options, user);
  };

  slots(): number {
    return this.parent.system.gearSlots ?? 0;
  }

  canEquipInSlot(slot: string): boolean {
    switch (slot) {
      case 'fullBody':
        return this.parent.system.isFullBody;
      case 'head':
        return this.parent.system.body.head;
      case 'back':
        return this.parent.system.body.back;
      case 'torso':
        return this.parent.system.body.torso;
      case 'arms':
        return this.parent.system.body.arms;
      case 'hands':
        return this.parent.system.body.hands;
      case 'waist':
        return this.parent.system.body.waist;
      case 'legs':
        return this.parent.system.body.legs;
      case 'feet':
        return this.parent.system.body.feet;
      default:
        return false;
    }
  }
}
