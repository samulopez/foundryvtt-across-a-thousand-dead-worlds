export const ID = 'across-a-thousand-dead-worlds';

export const TEMPLATES = {
  modifyRoll: `systems/${ID}/templates/roll/modify-roll.hbs`,
  creature: {
    header: `systems/${ID}/templates/creature/header.hbs`,
    detailsTab: `systems/${ID}/templates/creature/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/creature/notes-tab.hbs`,
  },
  deepDiver: {
    header: `systems/${ID}/templates/deep-diver/header.hbs`,
    detailsTab: `systems/${ID}/templates/deep-diver/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/deep-diver/notes-tab.hbs`,
  },
  mission: {
    header: `systems/${ID}/templates/mission/header.hbs`,
    detailsTab: `systems/${ID}/templates/mission/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/mission/notes-tab.hbs`,
  },
  npc: {
    header: `systems/${ID}/templates/npc/header.hbs`,
    detailsTab: `systems/${ID}/templates/npc/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/npc/notes-tab.hbs`,
  },
  siteExpedition: {
    header: `systems/${ID}/templates/site-expedition/header.hbs`,
    detailsTab: `systems/${ID}/templates/site-expedition/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/site-expedition/notes-tab.hbs`,
  },
};

export enum SORTING {
  alphabetically = 'alphabetically',
  manually = 'manually',
}
