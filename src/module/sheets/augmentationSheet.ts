import { TEMPLATES } from '../constants';

import type ATDWItem from '../item/item';

import ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;

const { HandlebarsApplicationMixin } = foundry.applications.api;

interface Context {
  enrichedDescription: string;
  enrichedNotes: string;
}

export default class ATDWAugmentationSheet<
  RenderContext extends ItemSheetV2.RenderContext & Context,
  Configuration extends ItemSheetV2.Configuration = ItemSheetV2.Configuration,
  RenderOptions extends ItemSheetV2.RenderOptions = ItemSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(ItemSheetV2)<RenderContext, Configuration, RenderOptions> {
  static DEFAULT_OPTIONS = {
    window: { resizable: true },
    position: { width: 520, height: 600 },
    classes: ['item'],
    form: { submitOnChange: true },
    tag: 'form',
    actions: {},
  };

  static TABS = {
    primary: {
      initial: 'details',
      labelPrefix: 'ATDW.Item.Tabs',
      tabs: [{ id: 'details' }, { id: 'notes' }],
    },
  };

  static PARTS = {
    header: {
      template: TEMPLATES.augmentation.header,
    },
    tabs: {
      template: `templates/generic/tab-navigation.hbs`, // From FoundryVTT
    },
    details: {
      template: TEMPLATES.augmentation.detailsTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    notes: {
      template: TEMPLATES.augmentation.notesTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
  };

  override get document(): ATDWItem<'augmentation'> {
    if (!super.document.isAugmentation()) {
      throw new Error('Item is not of type augmentation');
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

    return context;
  }
}
