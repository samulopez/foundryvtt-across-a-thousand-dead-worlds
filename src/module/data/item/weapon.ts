import { defineItemModel } from './gear';

import type { GearModelSchema } from './gear';
import type ATDWItem from '../../item/item';

const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

const defineWeaponModel = () => ({
  damage: new StringField({ required: true, initial: '' }),
  isMelee: new BooleanField({ required: true, initial: false }),
  range: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  isTwoHanded: new BooleanField({ required: true, initial: false }),
  traits: new SchemaField({
    armorPiercing: new BooleanField({ initial: false }),
    blast: new SchemaField({
      value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      active: new BooleanField({ initial: false }),
    }),
    burst: new BooleanField({ initial: false }),
    explosive: new SchemaField({
      value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      active: new BooleanField({ initial: false }),
    }),
    forceful: new BooleanField({ initial: false }),
    fullAuto: new BooleanField({ initial: false }),
    gas: new BooleanField({ initial: false }),
    incendiary: new BooleanField({ initial: false }),
    light: new BooleanField({ initial: false }),
    powerful: new BooleanField({ initial: false }),
    punishing: new SchemaField({
      value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      active: new BooleanField({ initial: false }),
    }),
    quick: new BooleanField({ initial: false }),
    recoil: new BooleanField({ initial: false }),
    row: new SchemaField({
      value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      active: new BooleanField({ initial: false }),
    }),
    slow: new BooleanField({ initial: false }),
    unwieldy: new BooleanField({ initial: false }),
    volatile: new BooleanField({ initial: false }),
    wellCrafted: new BooleanField({ initial: false }),
  }),
});

type WeaponModelSchema = ReturnType<typeof defineWeaponModel> & GearModelSchema;

type WeaponDataModelType = foundry.abstract.TypeDataModel<WeaponModelSchema, ATDWItem<'weapon'>>;

export default class WeaponDataModel extends foundry.abstract.TypeDataModel<WeaponModelSchema, ATDWItem<'weapon'>> {
  static defineSchema(): WeaponModelSchema {
    return { ...defineItemModel(), ...defineWeaponModel() };
  }

  _preUpdate: WeaponDataModelType['_preUpdate'] = async (changed, options, user) => {
    if (changed.system?.isMelee === true) {
      // eslint-disable-next-line no-param-reassign
      changed.system.range = 0;
    }
    return super._preUpdate(changed, options, user);
  };

  slots(): number {
    return this.parent.system.gearSlots ?? 0;
  }
}
