import { AVAILABILITY } from '../../constants';

import type ATDWItem from '../../item/item';

const { BooleanField, NumberField, StringField } = foundry.data.fields;

export const defineItemModel = () => ({
  price: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  availability: new StringField({ choices: AVAILABILITY, initial: AVAILABILITY.basic }),
  gearSlots: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  isLight: new BooleanField({ required: true, initial: false }),
  equippable: new BooleanField({ required: true, initial: false }),
  quantity: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),
  description: new StringField({ initial: '' }),
  notes: new StringField({ initial: '' }),
});

export type GearModelSchema = ReturnType<typeof defineItemModel>;
type GearModelType = foundry.abstract.TypeDataModel<GearModelSchema, ATDWItem<'gear'>>;

export default class GearDataModel extends foundry.abstract.TypeDataModel<GearModelSchema, ATDWItem<'gear'>> {
  static defineSchema(): GearModelSchema {
    return defineItemModel();
  }

  _preUpdate: GearModelType['_preUpdate'] = async (changed, options, user) => {
    if (changed.system?.isLight !== undefined && changed.system.isLight) {
      if (changed.type === 'gear') {
        // eslint-disable-next-line no-param-reassign
        changed.system.equippable = false;
      }
      // eslint-disable-next-line no-param-reassign
      changed.system.gearSlots = 0;
    }
    return super._preUpdate(changed, options, user);
  };

  slots(): number {
    if (this.parent.system.isLight) {
      return (this.parent.system.quantity ?? 0) * 0.1;
    }
    return this.parent.system.gearSlots ?? 0;
  }
}
