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
    skillsTab: `systems/${ID}/templates/deep-diver/skills-tab.hbs`,
    inventoryTab: `systems/${ID}/templates/deep-diver/inventory-tab.hbs`,
    personalityTab: `systems/${ID}/templates/deep-diver/personality-tab.hbs`,
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum NERVOUS_TIC {
  none = 'none',
  coughing = 'coughing',
  blinking = 'blinking',
  wrinklingYourNose = 'wrinklingYourNose',
  clickingYourFingers = 'clickingYourFingers',
  bouncingYourLeg = 'bouncingYourLeg',
  touchingOtherPeople = 'touchingOtherPeople',
  touchingOthersThings = 'touchingOthersThings',
  humming = 'humming',
  grunting = 'grunting',
  sniffing = 'sniffing',
  repeatingAPhrase = 'repeatingAPhrase',
  bitingYourNails = 'bitingYourNails',
  flippingACoinOrOtherSmallItem = 'flippingACoinOrOtherSmallItem',
  fiddlingWithAPendantOrBracelet = 'fiddlingWithAPendantOrBracelet',
  pullingYourHair = 'pullingYourHair',
  crackingBones = 'crackingBones',
  swaying = 'swaying',
  pacing = 'pacing',
  laughingLoudlyAndNervously = 'laughingLoudlyAndNervously',
  sighingConstantly = 'sighingConstantly',
}

export enum TALENT {
  none = 'none',
  aim = 'aim',
  backstab = 'backstab',
  bash = 'bash',
  bounceThrow = 'bounceThrow',
  breathControl = 'breathControl',
  calm = 'calm',
  careless = 'careless',
  charge = 'charge',
  cleave = 'cleave',
  compartmentalizedMind = 'compartmentalizedMind',
  counterAttack = 'counterAttack',
  coupDeGrace = 'coupDeGrace',
  diligentMedic = 'diligentMedic',
  discerning = 'discerning',
  dualWielding = 'dualWielding',
  duck = 'duck',
  everyoneCalmDown = 'everyoneCalmDown',
  fastFeet = 'fastFeet',
  fearless = 'fearless',
  fieldMedic = 'fieldMedic',
  frugal = 'frugal',
  goodNegotiator = 'goodNegotiator',
  hacking = 'hacking',
  hardToKill = 'hardToKill',
  ignoreCover = 'ignoreCover',
  lucky = 'lucky',
  marksman = 'marksman',
  momentum = 'momentum',
  movementEconomy = 'movementEconomy',
  multiTarget = 'multiTarget',
  neutralize = 'neutralize',
  overpower = 'overpower',
  overwhelm = 'overwhelm',
  packRat = 'packRat',
  parry = 'parry',
  pointBlankExpert = 'pointBlankExpert',
  quiet = 'quiet',
  rendArmor = 'rendArmor',
  resilient = 'resilient',
  resistTheTaint = 'resistTheTaint',
  resuscitate = 'resuscitate',
  skillBoost = 'skillBoost',
  stepWhereIStep = 'stepWhereIStep',
  stout = 'stout',
  strong = 'strong',
  targetedStrikes = 'targetedStrikes',
  tough = 'tough',
  vigorous = 'vigorous',
  weakSpot = 'weakSpot',
  wellConnected = 'wellConnected',
}

export const emotionalStates = [
  {
    value: -6,
    label: 'hopeless',
  },
  {
    value: -5,
    label: '',
  },
  {
    value: -4,
    label: 'enraged',
  },
  {
    value: -3,
    label: '',
  },
  {
    value: -2,
    label: 'nervous',
  },
  {
    value: -1,
    label: '',
  },
  {
    value: 0,
    label: 'composed',
  },
  {
    value: 1,
    label: '',
  },
  {
    value: 2,
    label: 'calm',
  },
  {
    value: 3,
    label: '',
  },
  {
    value: 4,
    label: 'hopeful',
  },
  {
    value: 5,
    label: '',
  },
  {
    value: 6,
    label: 'pleased',
  },
];
