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
  SORTING,
  TALENT,
  emotionalStates,
} from '../../constants';
import { getLocalization } from '../../helpers';

import { primaryAttributes, skillField, sortingField } from './helper';

import type ATDWActor from '../../actor/actor';
import type ATDWItem from '../../item/item';

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
  armor: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  rads: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  injuries: new StringField({ initial: '' }),
  emotion: new StringField({ required: true, choices: emotionalStates.map(({ value }) => `${value}`), initial: '0' }),
  gender: new StringField({ initial: '' }),
  age: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  details: new StringField({ initial: '' }),
  notes: new StringField({ initial: '' }),
  equipment: new SchemaField({
    rightHand: new DocumentUUIDField({ type: 'Item', required: false }),
    leftHand: new DocumentUUIDField({ type: 'Item', required: false }),
    fullBody: new DocumentUUIDField({ type: 'Item', required: false }),
    head: new DocumentUUIDField({ type: 'Item', required: false }),
    back: new DocumentUUIDField({ type: 'Item', required: false }),
    torso: new DocumentUUIDField({ type: 'Item', required: false }),
    arms: new DocumentUUIDField({ type: 'Item', required: false }),
    hands: new DocumentUUIDField({ type: 'Item', required: false }),
    waist: new DocumentUUIDField({ type: 'Item', required: false }),
    legs: new DocumentUUIDField({ type: 'Item', required: false }),
    feet: new DocumentUUIDField({ type: 'Item', required: false }),
  }),
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

  sortedItems(): Item.Implementation[] {
    if (this.parent.system.sorting === SORTING.alphabetically) {
      return this.parent.items.contents.sort((a, b) => a.name.localeCompare(b.name));
    }
    return this.parent.items.contents.sort((a, b) => a.sort - b.sort);
  }

  backpackItems(sortedItems: Item.Implementation[]): Item.Implementation[] {
    return sortedItems.filter((item) => this.parent.system.backpack.includes(item.uuid));
  }

  pocketsItems(sortedItems: Item.Implementation[]): Item.Implementation[] {
    return sortedItems.filter((item) => this.parent.system.pockets.includes(item.uuid));
  }

  currentBackpackCapacity(): number {
    return Math.floor(
      this.backpackItems(this.parent.items.contents).reduce((sum, item) => sum + item.system.slots(), 0),
    );
  }

  currentPocketsCapacity(): number {
    return this.pocketsItems(this.parent.items.contents).reduce((sum, item) => sum + (item.system.quantity ?? 1), 0);
  }

  isItemInList(list: string, item: Item.Implementation): boolean {
    switch (list) {
      case 'backpack':
        return this.parent.system.backpack.includes(item.uuid);
      case 'pockets':
        return this.parent.system.pockets.includes(item.uuid);
      default:
        return false;
    }
  }

  currentListForItem(item: Item.Implementation): string | null {
    if (this.parent.system.backpack.includes(item.uuid)) {
      return 'backpack';
    }
    if (this.parent.system.pockets.includes(item.uuid)) {
      return 'pockets';
    }
    return null;
  }

  canAddToBackpackList(newSlots: number): boolean {
    return this.currentBackpackCapacity() + newSlots <= (this.parent.system.maxBackpackSlots ?? 0);
  }

  canAddToPocketsList(newSlots: number): boolean {
    return this.currentPocketsCapacity() + newSlots <= (this.parent.system.maxPocketsSlots ?? 0);
  }

  canAddToList(list: string, item: Item.Implementation): boolean {
    switch (list) {
      case 'backpack':
        return this.canAddToBackpackList(item.system.slots());
      case 'pockets':
        if (!item.system.isLight) {
          return false;
        }
        return this.canAddToPocketsList(item.system.quantity ?? 1);
      default:
        return false;
    }
  }

  async removeItemFromLists(itemUUID: string) {
    return this.parent.update({
      system: {
        backpack: this.backpack.filter((id) => id !== itemUUID),
        pockets: this.pockets.filter((id) => id !== itemUUID),
        equipment: {
          rightHand:
            this.parent.system.equipment.rightHand === itemUUID ? null : this.parent.system.equipment.rightHand,
          leftHand: this.parent.system.equipment.leftHand === itemUUID ? null : this.parent.system.equipment.leftHand,
          fullBody: this.parent.system.equipment.fullBody === itemUUID ? null : this.parent.system.equipment.fullBody,
          head: this.parent.system.equipment.head === itemUUID ? null : this.parent.system.equipment.head,
          back: this.parent.system.equipment.back === itemUUID ? null : this.parent.system.equipment.back,
          torso: this.parent.system.equipment.torso === itemUUID ? null : this.parent.system.equipment.torso,
          arms: this.parent.system.equipment.arms === itemUUID ? null : this.parent.system.equipment.arms,
          hands: this.parent.system.equipment.hands === itemUUID ? null : this.parent.system.equipment.hands,
          waist: this.parent.system.equipment.waist === itemUUID ? null : this.parent.system.equipment.waist,
          legs: this.parent.system.equipment.legs === itemUUID ? null : this.parent.system.equipment.legs,
          feet: this.parent.system.equipment.feet === itemUUID ? null : this.parent.system.equipment.feet,
        },
      },
    });
  }

  async moveItemToList(list: string, item: Item.Implementation) {
    await this.removeItemFromLists(item.uuid);

    const result = await this.parent.update({
      system: {
        [list]: [...this[list], item.uuid],
      },
    });

    return result ? item : null;
  }

  async addItemToList(list: string, item: Item.Implementation) {
    const result = await this.parent.update({
      system: {
        [list]: [...this[list], item.uuid],
      },
    });
    return result ? item : null;
  }

  async toggleSorting() {
    const newSorting = this.parent.system.sorting === SORTING.manually ? SORTING.alphabetically : SORTING.manually;
    await this.parent.update({
      system: {
        sorting: newSorting,
      },
    });
  }

  equipmentItems(): {
    rightHand: Item.Implementation | null;
    leftHand: Item.Implementation | null;
    fullBody: Item.Implementation | null;
    head: Item.Implementation | null;
    back: Item.Implementation | null;
    torso: Item.Implementation | null;
    arms: Item.Implementation | null;
    hands: Item.Implementation | null;
    waist: Item.Implementation | null;
    legs: Item.Implementation | null;
    feet: Item.Implementation | null;
  } {
    return {
      rightHand: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.rightHand) ?? null,
      leftHand: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.leftHand) ?? null,
      fullBody: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.fullBody) ?? null,
      head: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.head) ?? null,
      back: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.back) ?? null,
      torso: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.torso) ?? null,
      arms: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.arms) ?? null,
      hands: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.hands) ?? null,
      waist: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.waist) ?? null,
      legs: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.legs) ?? null,
      feet: this.parent.items.find((item) => item.uuid === this.parent.system.equipment.feet) ?? null,
    };
  }

  canEquipWeapon(item: ATDWItem): { result: boolean; message: string } {
    const { system } = item;
    if (!system.equippable || item.type === 'armor') {
      return { result: false, message: getLocalization().localize('ATDW.Error.notEquippable') };
    }

    if (system.isTwoHanded && (this.parent.system.equipment.rightHand || this.parent.system.equipment.leftHand)) {
      return {
        result: false,
        message: getLocalization().localize('ATDW.Error.twoHandedHandsOccupied'),
      };
    }

    const equipment = this.equipmentItems();
    if ((equipment.rightHand?.system.isTwoHanded ?? false) || (equipment.leftHand?.system.isTwoHanded ?? false)) {
      return {
        result: false,
        message: getLocalization().localize('ATDW.Error.twoHandedAlreadyEquipped'),
      };
    }

    return { result: true, message: '' };
  }

  async addToRightHand(item: Item.Implementation) {
    await this.removeItemFromLists(item.uuid);

    const result = await this.parent.update({
      system: {
        equipment: {
          rightHand: item.uuid,
        },
      },
    });

    return result ? item : null;
  }

  async addToLeftHand(item: Item.Implementation) {
    await this.removeItemFromLists(item.uuid);

    const result = await this.parent.update({
      system: {
        equipment: {
          leftHand: item.uuid,
        },
      },
    });

    return result ? item : null;
  }

  async swapRightToLeftHand() {
    const currentRightHand = this.parent.system.equipment.rightHand;
    const currentLeftHand = this.parent.system.equipment.leftHand;

    await this.parent.update({
      system: {
        equipment: {
          rightHand: currentLeftHand,
          leftHand: currentRightHand,
        },
      },
    });
  }

  async addItemToEquipment(equipment: string, item: Item.Implementation) {
    await this.removeItemFromLists(item.uuid);

    const equipmentSystem = { ...this.parent.system.equipment };
    if (equipment !== '') {
      equipmentSystem[equipment] = item.uuid;
    }
    if (item.isArmor()) {
      if (item.system.isFullBody) {
        equipmentSystem.fullBody = item.uuid;
      }
      if (item.system.body.head) {
        equipmentSystem.head = item.uuid;
      }
      if (item.system.body.back) {
        equipmentSystem.back = item.uuid;
      }
      if (item.system.body.torso) {
        equipmentSystem.torso = item.uuid;
      }
      if (item.system.body.arms) {
        equipmentSystem.arms = item.uuid;
      }
      if (item.system.body.hands) {
        equipmentSystem.hands = item.uuid;
      }
      if (item.system.body.waist) {
        equipmentSystem.waist = item.uuid;
      }
      if (item.system.body.legs) {
        equipmentSystem.legs = item.uuid;
      }
      if (item.system.body.feet) {
        equipmentSystem.feet = item.uuid;
      }
    }

    const result = await this.parent.update({
      system: {
        equipment: equipmentSystem,
      },
    });

    return result ? item : null;
  }

  isSlotOccupied(slot: string, item: Item.Implementation): boolean {
    if (slot !== '' && this.parent.system.equipment[slot]) {
      return true;
    }
    if (item.isArmor()) {
      if (item.system.isFullBody && this.parent.system.equipment.fullBody) {
        return true;
      }
      if (item.system.body.head && this.parent.system.equipment.head) {
        return true;
      }
      if (item.system.body.back && this.parent.system.equipment.back) {
        return true;
      }
      if (item.system.body.torso && this.parent.system.equipment.torso) {
        return true;
      }
      if (item.system.body.arms && this.parent.system.equipment.arms) {
        return true;
      }
      if (item.system.body.hands && this.parent.system.equipment.hands) {
        return true;
      }
      if (item.system.body.waist && this.parent.system.equipment.waist) {
        return true;
      }
      if (item.system.body.legs && this.parent.system.equipment.legs) {
        return true;
      }
      if (item.system.body.feet && this.parent.system.equipment.feet) {
        return true;
      }
    }
    return false;
  }
}
