import { TEMPLATES } from '../constants';

import type ATDWActor from '../actor/actor';

import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

const { HandlebarsApplicationMixin } = foundry.applications.api;

interface Context {
  enrichedDescription: string;
  enrichedNotes: string;
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
  };

  static TABS = {
    primary: {
      initial: 'details',
      labelPrefix: 'ATDW.DeepDiver.Tabs',
      tabs: [{ id: 'details' }, { id: 'notes' }],
    },
  };

  static PARTS = {
    header: {
      template: TEMPLATES.deepDiver.header,
    },
    tabs: {
      template: `templates/generic/tab-navigation.hbs`, // From FoundryVTT
    },
    details: {
      template: TEMPLATES.deepDiver.detailsTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    notes: {
      template: TEMPLATES.deepDiver.notesTab,
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

    return context;
  }
}
