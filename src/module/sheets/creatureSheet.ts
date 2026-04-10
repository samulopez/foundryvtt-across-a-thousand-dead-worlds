import {
  CREATURE_COVERED_WITH,
  CREATURE_DRIVE,
  CREATURE_EYES_NUMBER,
  CREATURE_EYES_TYPE,
  CREATURE_FORE_LIMBS,
  CREATURE_GENERAL_APPEARANCE,
  CREATURE_HIND_LIMBS,
  CREATURE_INTELLIGENCE,
  CREATURE_LIMBS_AQUATIC,
  CREATURE_MOUTH,
  CREATURE_NUMBER_LIMBS,
  CREATURE_ROLE,
  CREATURE_SIZE,
  CREATURE_TYPE,
  CREATURE_UNIQUE_FEATURE,
  HIT_LOCATIONS,
  ID,
  KEYBINDINGS,
  TEMPLATES,
} from '../constants';
import { getGame, getLocalization } from '../helpers';

import type ATDWActor from '../actor/actor';

import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

const { HandlebarsApplicationMixin } = foundry.applications.api;

interface Context {
  typeOptions: { value: string; label: string }[];
  sizeOptions: { value: string; label: string }[];
  driveOptions: { value: string; label: string }[];
  intelligenceOptions: { value: string; label: string }[];
  roleOptions: { value: string; label: string }[];
  appearanceGeneralOptions: { value: string; label: string }[];
  appearanceCoveredWithOptions: { value: string; label: string }[];
  appearanceUniqueFeatureOptions: { value: string; label: string }[];
  appearanceNumberLimbsOptions: { value: string; label: string }[];
  appearanceLimbsAquaticOptions: { value: string; label: string }[];
  appearanceForeLimbsOptions: { value: string; label: string }[];
  appearanceHindLimbsOptions: { value: string; label: string }[];
  appearanceMouthOptions: { value: string; label: string }[];
  appearanceEyesTypeOptions: { value: string; label: string }[];
  appearanceEyesNumberOptions: { value: string; label: string }[];
  hitLocationOptions: { value: string; label: string }[];
  abilities: {
    name: string;
    description: string;
    isPassive: boolean;
    enrichedDescription: string;
    index: number;
  }[];
  enrichedDescription: string;
  enrichedNotes: string;
}

export default class CreatureSheet<
  RenderContext extends ActorSheetV2.RenderContext & Context,
  Configuration extends ActorSheetV2.Configuration = ActorSheetV2.Configuration,
  RenderOptions extends ActorSheetV2.RenderOptions = ActorSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(ActorSheetV2)<RenderContext, Configuration, RenderOptions> {
  static DEFAULT_OPTIONS = {
    window: { resizable: true },
    position: { width: 750, height: 770 },
    classes: ['actor', 'creature'],
    form: { submitOnChange: true },
    tag: 'form',
    actions: {
      rollHitLocation: this.#rollHitLocation,
      rollAwareness: this.#rollAwareness,
      rollAttackSkill: this.#rollAttackSkill,
      rollDamage: this.#rollDamage,
      addAbility: this.#addAbility,
      deleteAbility: this.#deleteAbility,
      rollAbilities: this.#rollAbilities,
    },
  };

  static TABS = {
    primary: {
      initial: 'details',
      labelPrefix: 'ATDW.Creature.Tabs',
      tabs: [{ id: 'details' }, { id: 'appearance' }],
    },
  };

  static PARTS = {
    header: {
      template: TEMPLATES.creature.header,
    },
    tabs: {
      template: `templates/generic/tab-navigation.hbs`, // From FoundryVTT
    },
    details: {
      template: TEMPLATES.creature.detailsTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
    appearance: {
      template: TEMPLATES.creature.appearanceTab,
      scrollable: [''], // needed to keep scroll position when re-rendering
    },
  };

  override get document(): ATDWActor<'creature'> {
    if (!super.document.isCreature()) {
      throw new Error('Actor is not a Creature');
    }
    return super.document;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.typeOptions = Object.entries(CREATURE_TYPE).map(([key, value]) => ({
      key,
      value,
      label: value !== CREATURE_TYPE.none ? getLocalization().localize(`ATDW.Creature.Sheet.type.${key}`) : '',
    }));

    context.sizeOptions = Object.entries(CREATURE_SIZE).map(([key, value]) => ({
      key,
      value,
      label: value !== CREATURE_SIZE.none ? getLocalization().localize(`ATDW.Creature.Sheet.size.${key}`) : '',
    }));

    context.driveOptions = Object.entries(CREATURE_DRIVE).map(([key, value]) => ({
      key,
      value,
      label: value !== CREATURE_DRIVE.none ? getLocalization().localize(`ATDW.Creature.Sheet.drive.${key}`) : '',
    }));

    context.intelligenceOptions = Object.entries(CREATURE_INTELLIGENCE).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_INTELLIGENCE.none
          ? getLocalization().localize(`ATDW.Creature.Sheet.intelligence.${key}`)
          : '',
    }));

    context.roleOptions = Object.entries(CREATURE_ROLE).map(([key, value]) => ({
      key,
      value,
      label: value !== CREATURE_ROLE.none ? getLocalization().localize(`ATDW.Creature.Sheet.role.${key}`) : '',
    }));

    context.appearanceGeneralOptions = Object.entries(CREATURE_GENERAL_APPEARANCE).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_GENERAL_APPEARANCE.none
          ? getLocalization().localize(`ATDW.Creature.Sheet.generalAppearance.${key}`)
          : '',
    }));

    context.appearanceCoveredWithOptions = Object.entries(CREATURE_COVERED_WITH).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_COVERED_WITH.none
          ? getLocalization().localize(`ATDW.Creature.Sheet.coveredWith.${key}`)
          : '',
    }));

    context.appearanceUniqueFeatureOptions = Object.entries(CREATURE_UNIQUE_FEATURE).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_UNIQUE_FEATURE.none
          ? getLocalization().localize(`ATDW.Creature.Sheet.uniqueFeature.${key}`)
          : '',
    }));

    context.appearanceNumberLimbsOptions = Object.entries(CREATURE_NUMBER_LIMBS).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_NUMBER_LIMBS.none
          ? getLocalization().localize(`ATDW.Creature.Sheet.numberLimbs.${key}`)
          : '',
    }));

    context.appearanceLimbsAquaticOptions = Object.entries(CREATURE_LIMBS_AQUATIC).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_LIMBS_AQUATIC.none
          ? getLocalization().localize(`ATDW.Creature.Sheet.limbsAquatic.${key}`)
          : '',
    }));

    context.appearanceForeLimbsOptions = Object.entries(CREATURE_FORE_LIMBS).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_FORE_LIMBS.none ? getLocalization().localize(`ATDW.Creature.Sheet.foreLimbs.${key}`) : '',
    }));

    context.appearanceHindLimbsOptions = Object.entries(CREATURE_HIND_LIMBS).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_HIND_LIMBS.none ? getLocalization().localize(`ATDW.Creature.Sheet.hindLimbs.${key}`) : '',
    }));

    context.appearanceMouthOptions = Object.entries(CREATURE_MOUTH).map(([key, value]) => ({
      key,
      value,
      label: value !== CREATURE_MOUTH.none ? getLocalization().localize(`ATDW.Creature.Sheet.mouth.${key}`) : '',
    }));

    context.appearanceEyesTypeOptions = Object.entries(CREATURE_EYES_TYPE).map(([key, value]) => ({
      key,
      value,
      label: value !== CREATURE_EYES_TYPE.none ? getLocalization().localize(`ATDW.Creature.Sheet.eyesType.${key}`) : '',
    }));

    context.appearanceEyesNumberOptions = Object.entries(CREATURE_EYES_NUMBER).map(([key, value]) => ({
      key,
      value,
      label:
        value !== CREATURE_EYES_NUMBER.none ? getLocalization().localize(`ATDW.Creature.Sheet.eyesNumber.${key}`) : '',
    }));

    context.hitLocationOptions = Object.entries(HIT_LOCATIONS).map(([key, value]) => ({
      key,
      value,
      label: value !== HIT_LOCATIONS.none ? getLocalization().localize(`ATDW.Creature.Sheet.hitLocation.${key}`) : '',
    }));

    context.abilities = await Promise.all(
      this.document.system.abilities.map(async (ability, index) => ({
        name: ability.name,
        description: ability.description,
        isPassive: ability.isPassive ?? false,
        index: index + 1,
        enrichedDescription: await foundry.applications.ux.TextEditor.implementation.enrichHTML(ability.description, {
          secrets: this.document.isOwner,
          relativeTo: this.document,
        }),
      })),
    );

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

  static async #rollHitLocation(this, event: PointerEvent) {
    event.preventDefault();
    await this.document.rollHitLocation();
  }

  static async #rollAwareness(this, event: PointerEvent) {
    event.preventDefault();

    const modifyRollKey = getGame().keybindings?.get(ID, KEYBINDINGS.modifyRoll);
    const downKeys = getGame().keyboard?.downKeys;

    const isModifyRollPressed =
      (modifyRollKey?.length ?? 0) > 0 && (modifyRollKey?.some((rollKey) => downKeys?.has(rollKey.key)) ?? false);
    if (!isModifyRollPressed) {
      await this.document.rollAwareness(0);
      return;
    }

    const content = await foundry.applications.handlebars.renderTemplate(TEMPLATES.modifyRoll, {
      originalValue: this.document.system.awareness,
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
          await this.document.rollAwareness(Number(value), advantageOrDisadvantage);
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
              await this.document.rollAwareness(0, advantageOrDisadvantage);
              return;
            }

            await this.document.rollAwareness(Number(`${plusOrMinus}${valueModifier}`), advantageOrDisadvantage);
          },
        },
      ],
    }).render({ force: true });
  }

  static async #rollAttackSkill(this, event: PointerEvent) {
    event.preventDefault();

    const modifyRollKey = getGame().keybindings?.get(ID, KEYBINDINGS.modifyRoll);
    const downKeys = getGame().keyboard?.downKeys;
    const isModifyRollPressed =
      (modifyRollKey?.length ?? 0) > 0 && (modifyRollKey?.some((rollKey) => downKeys?.has(rollKey.key)) ?? false);
    if (!isModifyRollPressed) {
      await this.document.rollAttackSkill(0);
      return;
    }

    const content = await foundry.applications.handlebars.renderTemplate(TEMPLATES.modifyRoll, {
      originalValue: this.document.system.attackSkill.value,
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
          await this.document.rollAttackSkill(Number(value), advantageOrDisadvantage);
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
              await this.document.rollAttackSkill(0, advantageOrDisadvantage);
              return;
            }

            await this.document.rollAttackSkill(Number(`${plusOrMinus}${valueModifier}`), advantageOrDisadvantage);
          },
        },
      ],
    }).render({ force: true });
  }

  static async #rollDamage(this, event: PointerEvent) {
    event.preventDefault();

    const modifyRollKey = getGame().keybindings?.get(ID, KEYBINDINGS.modifyRoll);
    const downKeys = getGame().keyboard?.downKeys;
    const isModifyRollPressed =
      (modifyRollKey?.length ?? 0) > 0 && (modifyRollKey?.some((rollKey) => downKeys?.has(rollKey.key)) ?? false);
    if (!isModifyRollPressed) {
      await this.document.rollDamage(0);
      return;
    }

    const content = await foundry.applications.handlebars.renderTemplate(TEMPLATES.modifyRoll, {
      originalValue: this.document.system.damage,
      hideAdvantageOrDisadvantage: true,
    });

    new foundry.applications.api.DialogV2({
      window: { title: getLocalization().localize('ATDW.ModifyRollDialogue.title') },
      modal: true,
      classes: ['modify-roll-dialogue'],
      content,
      actions: {
        rollWithModifier: async (eventButton) => {
          const buttonSubmit = eventButton.target as HTMLButtonElement;
          const { value } = buttonSubmit.dataset;
          if (!value) {
            return;
          }

          await this.document.rollDamage(Number(value));
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
            const plusOrMinus = html.querySelector('[name="plusOrMinus"]')?.value;
            const valueModifier = html.querySelector('[name="valueModifier"]')?.value;
            if (!valueModifier?.trim()) {
              await this.document.rollDamage(0);
              return;
            }

            await this.document.rollDamage(Number(`${plusOrMinus}${valueModifier}`));
          },
        },
      ],
    }).render({ force: true });
  }

  static async #addAbility(this, event: PointerEvent) {
    event.preventDefault();
    await this.actor.system.addAbility();
  }

  static async #deleteAbility(this, event: PointerEvent) {
    event.preventDefault();
    const button = event.target as HTMLElement;
    const { index } = button.dataset;
    if (!index) {
      return;
    }
    await this.actor.system.deleteAbility(parseInt(index, 10));
  }

  static async #rollAbilities(this, event: PointerEvent) {
    event.preventDefault();
    const message = await this.document.rollAbilities();
    if (message) {
      ui.notifications?.warn(message);
    }
  }
}
