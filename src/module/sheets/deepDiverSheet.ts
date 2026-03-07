import { BACKGROUND, EARN_PLACE, NERVOUS_TIC, TALENT, TEMPLATES, emotionalStates } from '../constants';
import { getLocalization } from '../helpers';

import type ATDWActor from '../actor/actor';

import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

const { HandlebarsApplicationMixin } = foundry.applications.api;

interface Context {
  enrichedInjuries: string;
  enrichedObsessionsAndNegativeTraits: string;
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

    return context;
  }
}
