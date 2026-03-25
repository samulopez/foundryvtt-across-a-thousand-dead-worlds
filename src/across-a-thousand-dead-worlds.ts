import './styles/style.scss';

import ATDWActor from './module/actor/actor';
import { ID, TEMPLATES } from './module/constants';
import {
  CreatureDataModel,
  DeepDiverDataModel,
  MissionDataModel,
  NPCDataModel,
  SiteExpeditionDataModel,
} from './module/data';
import { registerSettings } from './module/settings';
import CreatureSheet from './module/sheets/creatureSheet';
import DeepDiverSheet from './module/sheets/deepDiverSheet';
import MissionSheet from './module/sheets/missionSheet';
import NPCSheet from './module/sheets/npcSheet';
import SiteExpeditionSheet from './module/sheets/siteExpeditionSheet';

Hooks.once('init', async () => {
  // Configure custom Document implementations.
  CONFIG.Actor.documentClass = ATDWActor;
  // Configure System Data Models.
  CONFIG.Actor.dataModels = {
    creature: CreatureDataModel,
    deepDiver: DeepDiverDataModel,
    mission: MissionDataModel,
    npc: NPCDataModel,
    siteExpedition: SiteExpeditionDataModel,
  };
  CONFIG.Actor.trackableAttributes = {
    deepDiver: {
      bar: ['secondaryAttributes.wounds', 'secondaryAttributes.stamina'],
      value: ['level'],
    },
    npc: {
      bar: ['secondaryAttributes.wounds'],
      value: [],
    },
    creature: {
      bar: ['secondaryAttributes.wounds'],
      value: [],
    },
  };
  foundry.documents.collections.Actors.unregisterSheet('core', foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(ID, CreatureSheet, {
    makeDefault: true,
    themes: null,
    label: 'ATDW Creature Sheet',
    types: ['creature'],
  });
  foundry.documents.collections.Actors.registerSheet(ID, DeepDiverSheet, {
    makeDefault: true,
    themes: null,
    label: 'ATDW Deep Diver Sheet',
    types: ['deepDiver'],
  });
  foundry.documents.collections.Actors.registerSheet(ID, MissionSheet, {
    makeDefault: true,
    themes: null,
    label: 'ATDW Mission Sheet',
    types: ['mission'],
  });
  foundry.documents.collections.Actors.registerSheet(ID, NPCSheet, {
    makeDefault: true,
    themes: null,
    label: 'ATDW NPC Sheet',
    types: ['npc'],
  });
  foundry.documents.collections.Actors.registerSheet(ID, SiteExpeditionSheet, {
    makeDefault: true,
    themes: null,
    label: 'ATDW Site Expedition Sheet',
    types: ['siteExpedition'],
  });

  registerSettings();

  // Preload Handlebars templates
  await foundry.applications.handlebars.loadTemplates(Object.values(foundry.utils.flattenObject(TEMPLATES)));
});
