import { ID, KEYBINDINGS, TALENT_NPC, TEMPLATES } from '../constants';
import { getGame, getLocalization } from '../helpers';

import type ATDWActor from '../actor/actor';
import type ATDWItem from '../item/item';

import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

const { HandlebarsApplicationMixin } = foundry.applications.api;

interface Context {
  talent1Options: { value: string; label: string }[];
  talent2Options: { value: string; label: string }[];
  talent3Options: { value: string; label: string }[];
  talent4Options: { value: string; label: string }[];
  talent5Options: { value: string; label: string }[];
  gearList: { item: Item.Implementation; slots: number }[];
  enrichedDescription: string;
  enrichedNotes: string;
}

export default class NPCSheet<
  RenderContext extends ActorSheetV2.RenderContext & Context,
  Configuration extends ActorSheetV2.Configuration = ActorSheetV2.Configuration,
  RenderOptions extends ActorSheetV2.RenderOptions = ActorSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(ActorSheetV2)<RenderContext, Configuration, RenderOptions> {
  static DEFAULT_OPTIONS = {
    window: { resizable: true },
    position: { width: 750, height: 770 },
    classes: ['actor', 'npc'],
    form: { submitOnChange: true },
    tag: 'form',
    actions: {
      rollAttribute: this.#rollAttribute,
      toggleExpand: this.#toggleExpand,
      removeItem: this.#removeItem,
      editItem: this.#editItem,
      increaseQuantityItem: this.#increaseQuantityItem,
      decreaseQuantityItem: this.#decreaseQuantityItem,
      toggleSorting: this.#toggleSorting,
      rollHitLocation: this.#rollHitLocation,
    },
  };

  static TABS = {
    primary: {
      initial: 'skills',
      labelPrefix: 'ATDW.NPC.Tabs',
      tabs: [{ id: 'skills' }, { id: 'inventory' }, { id: 'notes' }],
    },
  };

  static PARTS = {
    header: {
      template: TEMPLATES.npc.header,
    },
    tabs: {
      template: `templates/generic/tab-navigation.hbs`, // From FoundryVTT
    },
    skills: {
      template: TEMPLATES.npc.detailsTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    inventory: {
      template: TEMPLATES.npc.inventoryTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    notes: {
      template: TEMPLATES.npc.notesTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
  };

  override get document(): ATDWActor<'npc'> {
    if (!super.document.isNPC()) {
      throw new Error('Actor is not an NPC');
    }
    return super.document;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.document.system.description,
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

    const talents = Object.entries(TALENT_NPC).map(([key, value]) => ({
      key,
      value,
      label: value !== TALENT_NPC.none ? getLocalization().localize(`ATDW.DeepDiver.Sheet.talents.${key}`) : '',
    }));

    context.talent1Options = talents.filter(
      ({ key, value }) =>
        value === TALENT_NPC.none ||
        (key !== this.document.system.talent2 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent4 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent2Options = talents.filter(
      ({ key, value }) =>
        value === TALENT_NPC.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent4 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent3Options = talents.filter(
      ({ key, value }) =>
        value === TALENT_NPC.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent2 &&
          key !== this.document.system.talent4 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent4Options = talents.filter(
      ({ key, value }) =>
        value === TALENT_NPC.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent2 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent5),
    ); // Filter out talents already selected in other fields

    context.talent5Options = talents.filter(
      ({ key, value }) =>
        value === TALENT_NPC.none ||
        (key !== this.document.system.talent1 &&
          key !== this.document.system.talent2 &&
          key !== this.document.system.talent3 &&
          key !== this.document.system.talent4),
    ); // Filter out talents already selected in other fields

    context.gearList = this.document.system
      .sortedItems()
      .map((item) => ({ item, slots: Math.floor(item.system.slots()) }));

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

  async _onDropItem(event: DragEvent, item: ATDWItem) {
    const target = event.target as HTMLElement;
    const targetItem = target.closest<HTMLElement>('[data-item-id]');
    if (targetItem?.dataset.itemId === item.id) {
      // Don't sort the same item on itself
      return null;
    }
    const listDropped = !!target.closest('.backpack-list');

    const sameActorItem = item?.parent?.id === this.document.id;

    if (sameActorItem) {
      if (listDropped) {
        await this._onSortItem(event, item);
        return null;
      }

      return null;
    }

    if (listDropped) {
      const newItem = await super._onDropItem(event, item);
      if (!newItem) {
        return null;
      }
      await this._onSortItem(event, newItem);
      return newItem;
    }

    return null;
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

  static async #toggleSorting(this, event, _target) {
    event.preventDefault();

    await this.document.system.toggleSorting();
  }

  static async #rollHitLocation(this, event: PointerEvent) {
    event.preventDefault();
    await this.document.rollHitLocation();
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
}
