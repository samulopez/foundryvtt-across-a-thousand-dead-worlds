import { AVAILABILITY } from '../constants';

export default class ATDWItem<out SubType extends Item.SubType = Item.SubType> extends Item<SubType> {
  constructor(data: Item.CreateData<SubType>, context?: Item.ConstructionContext) {
    const newData = data;
    if (!newData.img) {
      if (newData.type === 'weapon') {
        newData.img = 'icons/svg/sword.svg';
      }
      if (newData.type === 'armor') {
        newData.img = 'icons/svg/shield.svg';
      }
    }

    super(newData, context);

    if (newData.type === 'weapon' || newData.type === 'armor') {
      this.updateSource({ system: { equippable: true } });
    }
    if (newData.type === 'augmentation') {
      this.updateSource({ system: { equippable: true, availability: AVAILABILITY.rare } });
    }
  }

  isGear(): this is ATDWItem<'gear'> {
    return this.type === 'gear';
  }

  isWeapon(): this is ATDWItem<'weapon'> {
    return this.type === 'weapon';
  }

  isArmor(): this is ATDWItem<'armor'> {
    return this.type === 'armor';
  }

  isAugmentation(): this is ATDWItem<'augmentation'> {
    return this.type === 'augmentation';
  }
}
