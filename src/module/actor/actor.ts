import { HIT_LOCATIONS, HIT_LOCATION_TABLES, TEMPLATES } from '../constants';
import { getLocalization } from '../helpers';

export default class ATDWActor<out SubType extends Actor.SubType = Actor.SubType> extends Actor<SubType> {
  constructor(data: Actor.CreateData<SubType>, context?: Actor.ConstructionContext) {
    const newData = data;
    if (!newData.img) {
      if (newData.type === 'creature') {
        newData.img = 'icons/svg/terror.svg';
      }
    }

    super(newData, context);
  }

  async rollSkill(skillKey: string, modifier: number, advantageOrDisadvantage?: string) {
    if (!this.isDeepDiver()) {
      throw new Error('Actor is not a Deep Diver');
    }

    const skill = this.system.skills[skillKey] as { value: number; temporaryModifier: number } | undefined;
    if (!skill) {
      throw new Error(`Skill ${skillKey} not found`);
    }

    await this.rollAttributeOrSkill(
      {
        ...skill,
        rollText: getLocalization().format('ATDW.Rolls.skillCheck', {
          skill: getLocalization().localize(`ATDW.DeepDiver.Sheet.skills.${skillKey}`),
        }),
      },
      modifier,
      advantageOrDisadvantage,
    );
  }

  async rollAttribute(attributeKey: string, modifier: number, advantageOrDisadvantage?: string) {
    if (!this.isDeepDiver() && !this.isNPC()) {
      throw new Error('Actor is not a Deep Diver');
    }

    const attribute = this.system.primaryAttributes[attributeKey] as
      | { value: number; temporaryModifier: number }
      | undefined;
    if (!attribute) {
      throw new Error(`Attribute ${attributeKey} not found`);
    }

    await this.rollAttributeOrSkill(
      {
        ...attribute,
        rollText: getLocalization().format('ATDW.Rolls.attributeCheck', {
          attribute: getLocalization().localize(`ATDW.DeepDiver.Sheet.primaryAttributes.${attributeKey}`),
        }),
      },
      modifier,
      advantageOrDisadvantage,
    );
  }

  async rollAttributeOrSkill(
    item: { value: number; temporaryModifier: number; rollText: string },
    modifier: number,
    advantageOrDisadvantage?: string,
  ) {
    let value = modifier ? item.value + modifier : item.value;
    const temporaryModifier = item.temporaryModifier || 0;
    if (temporaryModifier !== 0) {
      value += temporaryModifier;
    }

    const roll = new Roll(advantageOrDisadvantage ? '2d20' : '1d20');
    await roll.evaluate();
    let total = roll.total ?? 0;
    if (advantageOrDisadvantage) {
      const rolls = roll.dice[0].results;
      total =
        advantageOrDisadvantage === 'advantage'
          ? Math.max(...rolls.map((r) => r.result))
          : Math.min(...rolls.map((r) => r.result));
    }

    value += total ?? 0;

    let resultString = getLocalization().localize('ATDW.Rolls.success');
    let customClass = 'success-text';

    const isCritical = total === 1 || total === 20;
    if (total === 1 || value < 20) {
      resultString = getLocalization().localize('ATDW.Rolls.failure');
      customClass = 'failure-text';
    }

    const html = await foundry.applications.handlebars.renderTemplate(TEMPLATES.resultRoll, {
      resultString: isCritical ? getLocalization().format('ATDW.Rolls.critical', { type: resultString }) : resultString,
      customClass,
      formula: roll.formula,
      total,
    });

    let flavor = `${this.name}: ${item.rollText}<br>${value} >= 20 (${total} ${getLocalization().localize('ATDW.Rolls.roll')} + ${item.value} ${getLocalization().localize('ATDW.Rolls.base')}${temporaryModifier !== 0 ? ` ${temporaryModifier > 0 ? '+ ' : '- '} ${Math.abs(temporaryModifier)} ${getLocalization().localize('KN.Rolls.tempModifier')}` : ''}${modifier !== 0 ? ` ${modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`}` : ''} >= 20)`;

    if (isCritical) {
      flavor = `${this.name}: ${item.rollText}<br>`;
    }

    await roll.toMessage({
      content: html,
      flavor,
    });
  }

  async rollHitLocation() {
    if (!this.isCreature() && !this.isNPC() && !this.isDeepDiver()) {
      throw new Error('Actor is not a valid type for hit location roll');
    }
    if (this.system.hitLocation === HIT_LOCATIONS.none) {
      return;
    }

    const roll = new Roll('1d10');
    await roll.evaluate();
    const total = roll.total ?? 0;

    const hitLocationTable = HIT_LOCATION_TABLES[this.system.hitLocation];
    if (!hitLocationTable) {
      return;
    }

    const hitLocation = hitLocationTable.find((hl) => total >= hl.startDie && total <= hl.endDie);
    if (!hitLocation) {
      return;
    }
    const resultString = getLocalization().format('ATDW.Rolls.rollHitLocation.result', {
      location: getLocalization().localize(`ATDW.Creature.Sheet.hitLocation.option.${hitLocation.location}`),
      modifier:
        hitLocation.damageModifier > 0 ? `+${hitLocation.damageModifier}` : hitLocation.damageModifier.toString(),
    });

    const html = await foundry.applications.handlebars.renderTemplate(TEMPLATES.resultRoll, {
      resultString,
      customClass: '',
      formula: roll.formula,
      total: roll.total,
    });

    await roll.toMessage({
      content: html,
      flavor: `${this.name}: ${getLocalization().format('ATDW.Rolls.rollHitLocation.title', {
        locationType: getLocalization().localize(`ATDW.Creature.Sheet.hitLocation.${this.system.hitLocation}`),
      })}`,
    });
  }

  async rollAwareness(modifier: number, advantageOrDisadvantage?: string) {
    if (!this.isCreature()) {
      throw new Error('Actor is not a Creature');
    }

    const value = this.system.awareness;

    await this.rollAttributeOrSkill(
      {
        value: value ?? 0,
        temporaryModifier: 0,
        rollText: getLocalization().format('ATDW.Rolls.check', {
          attribute: getLocalization().localize('ATDW.Creature.Sheet.awarenessLabel'),
        }),
      },
      modifier,
      advantageOrDisadvantage,
    );
  }

  async rollAttackSkill(modifier: number, advantageOrDisadvantage?: string) {
    if (!this.isCreature()) {
      throw new Error('Actor is not a Creature');
    }

    const skill = this.system.attackSkill as { value: number; temporaryModifier: number };

    await this.rollAttributeOrSkill(
      {
        ...skill,
        rollText: getLocalization().format('ATDW.Rolls.skillCheck', {
          skill: getLocalization().localize('ATDW.Creature.Sheet.attack'),
        }),
      },
      modifier,
      advantageOrDisadvantage,
    );
  }

  async rollDamage(modifier: number) {
    if (!this.isCreature()) {
      throw new Error('Actor is not a Creature');
    }

    const { damage } = this.system;
    if (!damage) {
      throw new Error('Actor does not have a valid damage value');
    }

    let modifierString = '';
    if (modifier !== 0) {
      modifierString = modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
    }

    const roll = new Roll(`${damage}${modifierString}`);
    await roll.evaluate();
    const total = roll.total ?? 0;

    const html = await foundry.applications.handlebars.renderTemplate(TEMPLATES.resultRoll, {
      resultString: getLocalization().localize('ATDW.Rolls.damage'),
      customClass: '',
      formula: roll.formula,
      total,
    });

    const flavor = `${this.name}: ${getLocalization().localize('ATDW.Rolls.damage')}: ${total}`;

    await roll.toMessage({
      content: html,
      flavor,
    });
  }

  async rollAbilities(): Promise<string> {
    if (!this.isCreature()) {
      throw new Error('Actor is not a Creature');
    }

    const activeAbilities = this.system.abilities.filter((ability) => !ability.isPassive);
    if (activeAbilities.length === 0) {
      return getLocalization().localize('ATDW.Error.invalidAbilities');
    }

    if (activeAbilities.length === 1) {
      return getLocalization().localize('ATDW.Error.onlyOneActiveAbility');
    }

    const roll = new Roll(`1d${activeAbilities.length}`);
    await roll.evaluate();
    const total = roll.total ?? 0;
    const ability = activeAbilities[total - 1];

    const html = await foundry.applications.handlebars.renderTemplate(TEMPLATES.abilitiesRoll, {
      resultString: ability.name,
      customClass: '',
      formula: roll.formula,
      total,
      description: await foundry.applications.ux.TextEditor.implementation.enrichHTML(ability.description, {
        secrets: this.isOwner,
        relativeTo: this,
      }),
    });

    const flavor = `${this.name}: ${getLocalization().localize('ATDW.Rolls.ability')}`;

    await roll.toMessage({
      content: html,
      flavor,
    });
    return '';
  }

  isCreature(): this is ATDWActor<'creature'> {
    return this.type === 'creature';
  }

  isDeepDiver(): this is ATDWActor<'deepDiver'> {
    return this.type === 'deepDiver';
  }

  isMission(): this is ATDWActor<'mission'> {
    return this.type === 'mission';
  }

  isNPC(): this is ATDWActor<'npc'> {
    return this.type === 'npc';
  }

  isSiteExpedition(): this is ATDWActor<'siteExpedition'> {
    return this.type === 'siteExpedition';
  }
}
