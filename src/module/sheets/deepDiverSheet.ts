import {
  BACKGROUND,
  DRIVE,
  EARN_PLACE,
  ID,
  KEYBINDINGS,
  LIFE_CHANGING_EVENT,
  MANNERISMS_BORED,
  MANNERISMS_CONFIDENT,
  MANNERISMS_FRUSTRATED,
  MANNERISMS_HAPPY,
  MANNERISMS_SHY,
  NERVOUS_TIC,
  TALENT,
  TEMPLATES,
  emotionalStates,
} from '../constants';
import { getGame, getLocalization } from '../helpers';

import type ATDWActor from '../actor/actor';
import type ATDWItem from '../item/item';

import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

const { HandlebarsApplicationMixin } = foundry.applications.api;

interface Context {
  enrichedInjuries: string;
  enrichedObsessionsAndNegativeTraits: string;
  enrichedOtherDetails: string;
  enrichedNotes: string;
  skills: { key: string; value?: number | null; temporaryModifier?: number | null }[];
  nervousTicOptions: { value: string; label: string }[];
  talent1Options: { value: string; label: string }[];
  talent2Options: { value: string; label: string }[];
  talent3Options: { value: string; label: string }[];
  talent4Options: { value: string; label: string }[];
  talent5Options: { value: string; label: string }[];
  emotionalStateNegativeOptions: { value: string; label: string }[];
  emotionalStateNeutralOptions: { value: string; label: string }[];
  emotionalStatePositiveOptions: { value: string; label: string }[];
  backgroundOptions: { value: string; label: string }[];
  howDidYouEarnYourPlaceOptions: { value: string; label: string }[];
  lifeChangingEventOptions: { value: string; label: string }[];
  driveOptions: { value: string; label: string }[];
  confidentOptions: { value: string; label: string }[];
  shyOptions: { value: string; label: string }[];
  boredOptions: { value: string; label: string }[];
  happyOptions: { value: string; label: string }[];
  frustratedOptions: { value: string; label: string }[];
  backpackList: { item: Item.Implementation; slots: number }[];
  currentBackpackCapacity: number;
  pocketsList: Item.Implementation[];
  currentPocketsCapacity: number;
  // TODO: delete this!
  itemsList: Item.Implementation[];
}

export default class DeepDiverSheet<
  RenderContext extends ActorSheetV2.RenderContext & Context,
  Configuration extends ActorSheetV2.Configuration = ActorSheetV2.Configuration,
  RenderOptions extends ActorSheetV2.RenderOptions = ActorSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(ActorSheetV2)<RenderContext, Configuration, RenderOptions> {
  static DEFAULT_OPTIONS = {
    window: { resizable: true },
    position: { width: 750, height: 770 },
    classes: ['actor', 'deep-diver'],
    form: { submitOnChange: true },
    tag: 'form',
    actions: {
      rollSkill: this.#rollSkill,
      rollAttribute: this.#rollAttribute,
      toggleExpand: this.#toggleExpand,
      removeItem: this.#removeItem,
      editItem: this.#editItem,
      increaseQuantityItem: this.#increaseQuantityItem,
      decreaseQuantityItem: this.#decreaseQuantityItem,
      toggleSorting: this.#toggleSorting,
    },
  };

  static TABS = {
    primary: {
      initial: 'skills',
      labelPrefix: 'ATDW.DeepDiver.Tabs',
      tabs: [
        { id: 'skills', tooltip: 'ATDW.DeepDiver.Tabs.tooltip.skills' },
        { id: 'inventory', tooltip: 'ATDW.DeepDiver.Tabs.tooltip.inventory' },
        { id: 'personality', tooltip: 'ATDW.DeepDiver.Tabs.tooltip.personality' },
      ],
    },
  };

  static PARTS = {
    header: {
      template: TEMPLATES.deepDiver.header,
    },
    tabs: {
      template: `templates/generic/tab-navigation.hbs`, // From FoundryVTT
    },
    skills: {
      template: TEMPLATES.deepDiver.skillsTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    inventory: {
      template: TEMPLATES.deepDiver.inventoryTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    personality: {
      template: TEMPLATES.deepDiver.personalityTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
  };

  override get document(): ATDWActor<'deepDiver'> {
    if (!super.document.isDeepDiver()) {
      throw new Error('Actor is not a Deep Diver');
    }
    return super.document;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.skills = Object.entries(this.document.system.skills).map(([key, value]) => ({
      key,
      ...value,
    }));

    context.enrichedInjuries = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.document.system.injuries,
      {
        secrets: this.document.isOwner,
        relativeTo: this.document,
      },
    );

    context.enrichedObsessionsAndNegativeTraits = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.document.system.obsessionsAndNegativeTraits,
      {
        secrets: this.document.isOwner,
        relativeTo: this.document,
      },
    );

    context.enrichedOtherDetails = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.document.system.personality.otherDetails,
      {
        secrets: this.document.isOwner,
        relativeTo: this.document,
      },
    );

    context.enrichedNotes = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.document.system.notes,
      {
        secrets: this.document.isOwner,
        relativeTo: this.document,
      },
    );

    context.nervousTicOptions = Object.entries(NERVOUS_TIC).map(([key, value]) => ({
      value,
      label: value !== NERVOUS_TIC.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.nervousTic.${key}`) : '',
    }));

    const talents = Object.entries(TALENT).map(([key, value]) => ({
      key,
      value,
      label: value !== TALENT.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.talents.${key}`) : '',
    }));

    context.talent1Options = talents.filter(
      ({ key, value }) =>
        value === TALENT.none ||
        (key !== this.document.system.talent2 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent4 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent2Options = talents.filter(
      ({ key, value }) =>
        value === TALENT.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent4 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent3Options = talents.filter(
      ({ key, value }) =>
        value === TALENT.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent2 &&
          key !== this.document.system.talent4 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent4Options = talents.filter(
      ({ key, value }) =>
        value === TALENT.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent2 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent5Options = talents.filter(
      ({ key, value }) =>
        value === TALENT.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent2 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent4),
    ); // Filter out talents already selected in other fields

    context.backgroundOptions = Object.entries(BACKGROUND).map(([key, value]) => ({
      value,
      label: value !== BACKGROUND.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.background.${key}`) : '',
    }));

    context.howDidYouEarnYourPlaceOptions = Object.entries(EARN_PLACE).map(([key, value]) => ({
      value,
      label:
        value !== EARN_PLACE.none
          ? getLocalization().localize(`ATDW.DeepDiver.Sheet.howDidYouEarnYourPlace.${key}`)
          : '',
    }));

    context.lifeChangingEventOptions = Object.entries(LIFE_CHANGING_EVENT).map(([key, value]) => ({
      value,
      label:
        value !== LIFE_CHANGING_EVENT.none
          ? getLocalization().localize(`ATDW.DeepDiver.Sheet.lifeChangingEvent.${key}`)
          : '',
    }));

    context.driveOptions = Object.entries(DRIVE).map(([key, value]) => ({
      value,
      label: value !== DRIVE.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.drive.${key}`) : '',
    }));

    context.confidentOptions = Object.entries(MANNERISMS_CONFIDENT).map(([key, value]) => ({
      value,
      label:
        value !== MANNERISMS_CONFIDENT.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.confident.${key}`) : '',
    }));

    context.shyOptions = Object.entries(MANNERISMS_SHY).map(([key, value]) => ({
      value,
      label: value !== MANNERISMS_SHY.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.shy.${key}`) : '',
    }));

    context.boredOptions = Object.entries(MANNERISMS_BORED).map(([key, value]) => ({
      value,
      label: value !== MANNERISMS_BORED.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.bored.${key}`) : '',
    }));

    context.happyOptions = Object.entries(MANNERISMS_HAPPY).map(([key, value]) => ({
      value,
      label: value !== MANNERISMS_HAPPY.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.happy.${key}`) : '',
    }));

    context.frustratedOptions = Object.entries(MANNERISMS_FRUSTRATED).map(([key, value]) => ({
      value,
      label:
        value !== MANNERISMS_FRUSTRATED.none
          ? getLocalization().localize(`ATDW.DeepDiver.Sheet.frustrated.${key}`)
          : '',
    }));

    context.emotionalStateNegativeOptions = emotionalStates
      .filter(({ value }) => value < -1)
      .map(({ value, label }) => ({
        value: `${value}`,
        label: label ? getLocalization().localize(`ATDW.DeepDiver.Sheet.emotionalState.${label}`) : '',
      }));

    context.emotionalStateNeutralOptions = emotionalStates
      .filter(({ value }) => value > -2 && value < 2)
      .map(({ value, label }) => ({
        value: `${value}`,
        label: label ? getLocalization().localize(`ATDW.DeepDiver.Sheet.emotionalState.${label}`) : '',
      }));

    context.emotionalStatePositiveOptions = emotionalStates
      .filter(({ value }) => value > 1)
      .map(({ value, label }) => ({
        value: `${value}`,
        label: label ? getLocalization().localize(`ATDW.DeepDiver.Sheet.emotionalState.${label}`) : '',
      }));

    const sortedItems = this.document.system.sortedItems();
    context.backpackList = this.document.system
      .backpackItems(sortedItems)
      .map((item) => ({ item, slots: Math.floor(item.system.slots()) }));
    context.currentBackpackCapacity = this.document.system.currentBackpackCapacity();
    context.pocketsList = this.document.system.pocketsItems(sortedItems);
    context.currentPocketsCapacity = this.document.system.currentPocketsCapacity();
    context.itemsList = sortedItems;

    return context;
  }

  async _onDragStart(event) {
    const target = event.currentTarget as HTMLElement;
    const row = target.closest<HTMLElement>('[data-uuid]');
    const itemId = row?.dataset.itemId ?? target.dataset.key;
    if (itemId && event.dataTransfer) {
      const item = this.document.items.get(itemId);
      if (item) {
        const dragData = item.toDragData ? item.toDragData() : { type: 'Item', uuid: item.uuid };
        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }
    }
    super._onDragStart(event);
  }

  _dropInEquipment(_event: DragEvent): string {
    return '';
  }

  _dropInList(event: DragEvent): string {
    const target = event.target as HTMLElement;
    if (target.closest('.backpack-list')) {
      return 'backpack';
    }
    if (target.closest('.pockets-list')) {
      return 'pockets';
    }

    return '';
  }

  async _onDropItem(event: DragEvent, item: ATDWItem) {
    const target = event.target as HTMLElement;
    const targetItem = target.closest<HTMLElement>('[data-item-id]');
    if (targetItem?.dataset.itemId === item.id) {
      // Don't sort the same item on itself
      return null;
    }
    // const dropInMainHand = !!target.closest('.main-hand');
    // const dropInOffHand = !!target.closest('.off-hand');
    // const equipmentDropped = this._dropInEquipment(event);
    const listDropped = this._dropInList(event);

    // const droppingOnHands = dropInMainHand || dropInOffHand;

    const sameActorItem = item?.parent?.id === this.document.id;

    if (sameActorItem) {
      // TODO

      // if (droppingOnHands) {
      //   const { result, message } = this.document.system.canEquipWeapon(item);
      //   if (!result) {
      //     ui.notifications?.warn(message);
      //     return null;
      //   }

      //   if (dropInMainHand && this.document.system.equipment.offHand === item.uuid) {
      //     await this.document.update({ system: { equipment: { offHand: null } } });
      //   }

      //   if (dropInOffHand && this.document.system.equipment.mainHand === item.uuid) {
      //     await this.document.update({ system: { equipment: { mainHand: null } } });
      //   }

      //   const targetHand = dropInMainHand
      //     ? this.document.system.equipment.mainHand
      //     : this.document.system.equipment.offHand;
      //   if (targetHand && targetHand !== item.uuid) {
      //     ui.notifications?.warn(getLocalization().localize('KN.Error.handAlreadyOccupied'));
      //     return null;
      //   }

      //   return dropInMainHand ? this.document.system.addToMainHand(item) : this.document.system.addToOffHand(item);
      // }

      // if (equipmentDropped) {
      //   if (!item.system.equippable) {
      //     ui.notifications?.warn(getLocalization().localize('KN.Error.notEquippable'));
      //     return null;
      //   }
      //   if (item.type === 'armor' && item.system.canEquipInSlot && !item.system.canEquipInSlot(equipmentDropped)) {
      //     ui.notifications?.warn(getLocalization().localize('KN.Error.armorSlotMismatch'));
      //     return null;
      //   }
      //   if (this.document.system.equipment[equipmentDropped]) {
      //     ui.notifications?.warn(getLocalization().localize('KN.Error.equipmentSlotOccupied'));
      //     return null;
      //   }
      //   return this.document.system.addItemToEquipment(equipmentDropped, item);
      // }

      if (listDropped) {
        if (this.document.system.isItemInList(listDropped, item)) {
          await this._onSortItem(event, item);
          return null;
        }
        if (!this.document.system.canAddToList(listDropped, item)) {
          ui.notifications?.warn(getLocalization().localize(`ATDW.Error.${listDropped}Capacity`));
          return null;
        }
        return this.document.system.moveItemToList(listDropped, item);
      }

      return null;
    }

    // TODO
    // if (droppingOnHands) {
    //   const targetHand = dropInMainHand
    //     ? this.document.system.equipment.mainHand
    //     : this.document.system.equipment.offHand;
    //   if (targetHand) {
    //     ui.notifications?.warn(getLocalization().localize('KN.Error.handAlreadyOccupied'));
    //     return null;
    //   }

    //   const { result, message } = this.document.system.canEquipWeapon(item);
    //   if (!result) {
    //     ui.notifications?.warn(message);
    //     return null;
    //   }

    //   const newItem = await super._onDropItem(event, item);
    //   if (!newItem) {
    //     return null;
    //   }

    //   return dropInMainHand ? this.document.system.addToMainHand(newItem) : this.document.system.addToOffHand(newItem);
    // }

    // if (equipmentDropped) {
    //   if (!item.system.equippable) {
    //     ui.notifications?.warn(getLocalization().localize('KN.Error.notEquippable'));
    //     return null;
    //   }
    //   if (item.type === 'armor' && item.system.canEquipInSlot && !item.system.canEquipInSlot(equipmentDropped)) {
    //     ui.notifications?.warn(getLocalization().localize('KN.Error.armorSlotMismatch'));
    //     return null;
    //   }
    //   return this._onDropToEquipment(event, equipmentDropped, item);
    // }

    if (listDropped) {
      if (!this.document.system.canAddToList(listDropped, item)) {
        ui.notifications?.warn(getLocalization().localize(`ATDW.Error.${listDropped}Capacity`));
        return null;
      }
      const newItem = await super._onDropItem(event, item);
      if (!newItem) {
        return null;
      }
      await this._onSortItem(event, newItem);
      return this.document.system.addItemToList(listDropped, newItem);
    }

    return null;
  }

  static async #rollSkill(this, event: PointerEvent) {
    event.preventDefault();
    const button = event.target as HTMLElement;
    const { key } = button.dataset;
    if (!key) {
      return;
    }

    const modifyRollKey = getGame().keybindings?.get(ID, KEYBINDINGS.modifyRoll);
    const downKeys = getGame().keyboard?.downKeys;
    const isModifyRollPressed =
      (modifyRollKey?.length ?? 0) > 0 && (modifyRollKey?.some((rollKey) => downKeys?.has(rollKey.key)) ?? false);
    if (!isModifyRollPressed) {
      await this.document.rollSkill(key, 0);
      return;
    }

    const content = await foundry.applications.handlebars.renderTemplate(TEMPLATES.modifyRoll, {
      originalValue: this.document.system.skills[key].value,
    });

    new foundry.applications.api.DialogV2({
      window: { title: getLocalization().localize('ATDW.ModifyRollDialogue.title') },
      modal: true,
      classes: ['modify-roll-dialogue'],
      content,
      actions: {
        rollWithModifier: async (eventButton, dialog) => {
          const buttonSubmit = eventButton.target as HTMLButtonElement;
          const { value } = buttonSubmit.dataset;
          if (!value) {
            return;
          }

          const advantageOrDisadvantage = dialog
            .closest('.modify-roll-dialogue')
            ?.querySelector<HTMLInputElement>('[name="advantageOrDisadvantage"]')?.value;
          await this.document.rollSkill(key, Number(value), advantageOrDisadvantage);
        },
      },
      buttons: [
        {
          default: true,
          action: 'roll',
          icon: 'fas fa-dice',
          label: getLocalization().localize('ATDW.ModifyRollDialogue.action'),
          callback: async (eventDialog, buttonDialog, dialog) => {
            const html = dialog.element;
            const advantageOrDisadvantage = html.querySelector('[name="advantageOrDisadvantage"]')?.value;
            const plusOrMinus = html.querySelector('[name="plusOrMinus"]')?.value;
            const valueModifier = html.querySelector('[name="valueModifier"]')?.value;
            if (!valueModifier?.trim()) {
              await this.document.rollSkill(key, 0, advantageOrDisadvantage);
              return;
            }

            await this.document.rollSkill(key, Number(`${plusOrMinus}${valueModifier}`), advantageOrDisadvantage);
          },
        },
      ],
    }).render({ force: true });
  }

  static async #rollAttribute(this, event: PointerEvent) {
    event.preventDefault();
    const button = event.target as HTMLElement;
    const { key } = button.dataset;
    if (!key) {
      return;
    }

    const modifyRollKey = getGame().keybindings?.get(ID, KEYBINDINGS.modifyRoll);
    const downKeys = getGame().keyboard?.downKeys;

    const isModifyRollPressed =
      (modifyRollKey?.length ?? 0) > 0 && (modifyRollKey?.some((rollKey) => downKeys?.has(rollKey.key)) ?? false);
    if (!isModifyRollPressed) {
      await this.document.rollAttribute(key, 0);
      return;
    }

    const content = await foundry.applications.handlebars.renderTemplate(TEMPLATES.modifyRoll, {
      originalValue: this.document.system.primaryAttributes[key].value,
    });

    new foundry.applications.api.DialogV2({
      window: { title: getLocalization().localize('ATDW.ModifyRollDialogue.title') },
      modal: true,
      classes: ['modify-roll-dialogue'],
      content,
      actions: {
        rollWithModifier: async (eventButton, dialog) => {
          const buttonSubmit = eventButton.target as HTMLButtonElement;
          const { value } = buttonSubmit.dataset;
          if (!value) {
            return;
          }

          const advantageOrDisadvantage = dialog
            .closest('.modify-roll-dialogue')
            ?.querySelector<HTMLInputElement>('[name="advantageOrDisadvantage"]')?.value;
          await this.document.rollAttribute(key, Number(value), advantageOrDisadvantage);
        },
      },
      buttons: [
        {
          default: true,
          action: 'roll',
          icon: 'fas fa-dice',
          label: getLocalization().localize('ATDW.ModifyRollDialogue.action'),
          callback: async (eventDialog, buttonDialog, dialog) => {
            const html = dialog.element;
            const advantageOrDisadvantage = html.querySelector('[name="advantageOrDisadvantage"]')?.value;
            const plusOrMinus = html.querySelector('[name="plusOrMinus"]')?.value;
            const valueModifier = html.querySelector('[name="valueModifier"]')?.value;
            if (!valueModifier?.trim()) {
              await this.document.rollAttribute(key, 0, advantageOrDisadvantage);
              return;
            }

            await this.document.rollAttribute(key, Number(`${plusOrMinus}${valueModifier}`), advantageOrDisadvantage);
          },
        },
      ],
    }).render({ force: true });
  }

  static async #toggleExpand(event, target) {
    const icon = target.querySelector(':scope > i');
    const row = target.closest('[data-uuid]');
    const { uuid } = row.dataset;
    const item = await fromUuid(uuid);
    if (!item) return;

    const expanded = !row.classList.contains('collapsed');
    row.classList.toggle('collapsed', expanded);
    icon.classList.toggle('fa-compress', !expanded);
    icon.classList.toggle('fa-expand', expanded);
  }

  static async #removeItem(this, event, target) {
    event.preventDefault();
    const { key } = target.dataset;
    const item = this.document.getEmbeddedDocument('Item', key, {});
    if (!item) {
      return;
    }
    await this.document.system.removeItemFromLists(item.uuid);
    await this.document.deleteEmbeddedDocuments('Item', [key]);
  }

  static async #editItem(this, event, target) {
    event.preventDefault();
    const { key } = target.dataset;
    const item = this.document.getEmbeddedDocument('Item', key, {});
    if (!item) {
      return;
    }
    item.sheet?.render({ force: true });
  }

  static async #increaseQuantityItem(this, event, target) {
    event.preventDefault();
    const { key } = target.dataset;
    const item = this.document.getEmbeddedDocument('Item', key, {});
    if (!item) {
      return;
    }

    const list = this.document.system.currentListForItem(item);

    switch (list) {
      case 'backpack':
        if (!this.document.system.canAddToBackpackList(0.1)) {
          ui.notifications?.warn(getLocalization().localize(`ATDW.Error.backpackCapacity`));
          return;
        }
        break;
      case 'pockets':
        if (!this.document.system.canAddToPocketsList(1)) {
          ui.notifications?.warn(getLocalization().localize(`ATDW.Error.pocketsCapacity`));
          return;
        }
        break;
      default:
        return;
    }

    const newQuantity = (item.system.quantity ?? 0) + 1;
    await item.update({ system: { quantity: newQuantity } });
  }

  static async #decreaseQuantityItem(this, event, target) {
    event.preventDefault();
    const { key } = target.dataset;
    const item = this.document.getEmbeddedDocument('Item', key, {});
    if (!item || item.system.quantity === 1) {
      return;
    }
    const newQuantity = (item.system.quantity ?? 0) - 1;
    await item.update({ system: { quantity: newQuantity } });
  }

  static async #toggleSorting(this, event, _target) {
    event.preventDefault();

    await this.document.system.toggleSorting();
  }
}
