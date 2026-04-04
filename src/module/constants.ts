export const ID = 'across-a-thousand-dead-worlds';

export const TEMPLATES = {
  modifyRoll: `systems/${ID}/templates/roll/modify-roll.hbs`,
  resultRoll: `systems/${ID}/templates/roll/result-roll.hbs`,
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
    inventoryTab: `systems/${ID}/templates/npc/inventory-tab.hbs`,
    notesTab: `systems/${ID}/templates/npc/notes-tab.hbs`,
  },
  siteExpedition: {
    header: `systems/${ID}/templates/site-expedition/header.hbs`,
    detailsTab: `systems/${ID}/templates/site-expedition/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/site-expedition/notes-tab.hbs`,
  },
  gear: {
    header: `systems/${ID}/templates/item/header.hbs`,
    detailsTab: `systems/${ID}/templates/item/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/item/notes-tab.hbs`,
    row: `systems/${ID}/templates/item/item-row.hbs`,
    equipmentRow: `systems/${ID}/templates/item/equipment-row.hbs`,
  },
  weapon: {
    header: `systems/${ID}/templates/weapon/header.hbs`,
    detailsTab: `systems/${ID}/templates/weapon/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/weapon/notes-tab.hbs`,
  },
  armor: {
    header: `systems/${ID}/templates/armor/header.hbs`,
    detailsTab: `systems/${ID}/templates/armor/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/armor/notes-tab.hbs`,
  },
  augmentation: {
    header: `systems/${ID}/templates/augmentation/header.hbs`,
    detailsTab: `systems/${ID}/templates/augmentation/details-tab.hbs`,
    notesTab: `systems/${ID}/templates/augmentation/notes-tab.hbs`,
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum TALENT_NPC {
  none = 'none',
  aim = 'aim',
  backstab = 'backstab',
  bash = 'bash',
  cleave = 'cleave',
  coupDeGrace = 'coupDeGrace',
  defensive = 'defensive',
  diligentMedic = 'diligentMedic',
  fast = 'fast',
  fieldMedic = 'fieldMedic',
  frugal = 'frugal',
  hacking = 'hacking',
  hardToKill = 'hardToKill',
  marksman = 'marksman',
  momentum = 'momentum',
  packMule = 'packMule',
  resuscitate = 'resuscitate',
  strong = 'strong',
  targetedStrikes = 'targetedStrikes',
  techSavvy = 'techSavvy',
  tough = 'tough',
}

export enum BACKGROUND {
  none = 'none',
  algaeFarmer = 'algaeFarmer',
  blueCollarWorker = 'blueCollarWorker',
  celebrity = 'celebrity',
  dataMiner = 'dataMiner',
  hedgeFundKid = 'hedgeFundKid',
  oceanSweeper = 'oceanSweeper',
  pettyCriminal = 'pettyCriminal',
  plasticMiner = 'plasticMiner',
  scavenger = 'scavenger',
  warlord = 'warlord',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum EARN_PLACE {
  none = 'none',
  savedForYears = 'savedForYears',
  scholarshipLottery = 'scholarshipLottery',
  familyMoney = 'familyMoney',
  illicitWays = 'illicitWays',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum LIFE_CHANGING_EVENT {
  none = 'none',
  abandonedByLove = 'abandonedByLove',
  terribleAccident = 'terribleAccident',
  someoneDiedBecauseOfYou = 'someoneDiedBecauseOfYou',
  religiousExperience = 'religiousExperience',
  witnessedRandomKindnessOrCruelty = 'witnessedRandomKindnessOrCruelty',
  learnedSomethingYouShouldntHave = 'learnedSomethingYouShouldntHave',
  forcedToActAgainstMorals = 'forcedToActAgainstMorals',
  missedChanceToStandUp = 'missedChanceToStandUp',
  foughtOffAddiction = 'foughtOffAddiction',
  discoveredSecretHalfSibling = 'discoveredSecretHalfSibling',
  becameImprisoned = 'becameImprisoned',
  riskedYourLifeForSomeone = 'riskedYourLifeForSomeone',
  someoneDiedToSaveYourLife = 'someoneDiedToSaveYourLife',
  gotCaughtInScandal = 'gotCaughtInScandal',
  sufferedAmnesia = 'sufferedAmnesia',
  madeTerribleEnemy = 'madeTerribleEnemy',
  fellToRuinBecauseOfPettiness = 'fellToRuinBecauseOfPettiness',
  hadSiblingMurdered = 'hadSiblingMurdered',
  discoveredUnknownTalent = 'discoveredUnknownTalent',
  foundFame = 'foundFame',
}

export enum DRIVE {
  none = 'none',
  wealth = 'wealth',
  power = 'power',
  fame = 'fame',
  wanderersLust = 'wanderersLust',
  knowledge = 'knowledge',
  information = 'information',
  espionage = 'espionage',
  somewhereToBelong = 'somewhereToBelong',
  nothingCanStopYou = 'nothingCanStopYou',
  adrenalineJunkie = 'adrenalineJunkie',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum MANNERISMS_CONFIDENT {
  none = 'none',
  walkStraight = 'walkStraight',
  standFeetApart = 'standFeetApart',
  talkLoudly = 'talkLoudly',
  readyToHelp = 'readyToHelp',
  flashyClothing = 'flashyClothing',
  interruptOthers = 'interruptOthers',
  boast = 'boast',
  smile = 'smile',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum MANNERISMS_SHY {
  none = 'none',
  avoidEyeContact = 'avoidEyeContact',
  walkLookingDown = 'walkLookingDown',
  crossArms = 'crossArms',
  apologizeALot = 'apologizeALot',
  keepHandsInPockets = 'keepHandsInPockets',
  fixHairConstantly = 'fixHairConstantly',
  speakSoftly = 'speakSoftly',
  laughNervously = 'laughNervously',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum MANNERISMS_BORED {
  none = 'none',
  yawnALot = 'yawnALot',
  stareIntoTheDistance = 'stareIntoTheDistance',
  humToYourself = 'humToYourself',
  tapYourFingernailsOnSurfaces = 'tapYourFingernailsOnSurfaces',
  toyWithRingsOrOtherAccessories = 'toyWithRingsOrOtherAccessories',
  twiddleYourThumbs = 'twiddleYourThumbs',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum MANNERISMS_HAPPY {
  none = 'none',
  laughALot = 'laughALot',
  smileAtEveryone = 'smileAtEveryone',
  touchOthersAffectionately = 'touchOthersAffectionately',
  chitChatConstantly = 'chitChatConstantly',
  commentOnNiceThings = 'commentOnNiceThings',
  tellJokes = 'tellJokes',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum MANNERISMS_FRUSTRATED {
  none = 'none',
  shakeYourHead = 'shakeYourHead',
  rollYourEyes = 'rollYourEyes',
  crackYourKnuckles = 'crackYourKnuckles',
  exhaleSharply = 'exhaleSharply',
  pace = 'pace',
  tapYourFoot = 'tapYourFoot',
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

export enum KEYBINDINGS {
  modifyRoll = 'modifyRoll',
}

export enum AVAILABILITY {
  basic = 'basic',
  rare = 'rare',
  experimental = 'experimental',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum HIT_LOCATIONS {
  none = 'none',
  humanoid = 'humanoid',
  quadruped = 'quadruped',
  serpentine = 'serpentine',
}

export const HIT_LOCATION_TABLES = {
  [HIT_LOCATIONS.humanoid]: [
    { startDie: 1, endDie: 1, location: 'feet', damageModifier: -1 },
    { startDie: 2, endDie: 2, location: 'legs', damageModifier: -1 },
    { startDie: 3, endDie: 3, location: 'waist', damageModifier: 0 },
    { startDie: 4, endDie: 4, location: 'hands', damageModifier: 0 },
    { startDie: 5, endDie: 5, location: 'arms', damageModifier: 0 },
    { startDie: 6, endDie: 8, location: 'torso', damageModifier: 1 },
    { startDie: 9, endDie: 9, location: 'back', damageModifier: 2 },
    { startDie: 10, endDie: 10, location: 'head', damageModifier: 3 },
  ],
  [HIT_LOCATIONS.quadruped]: [
    { startDie: 1, endDie: 2, location: 'hindlimb', damageModifier: -1 },
    { startDie: 3, endDie: 6, location: 'forelimb', damageModifier: 0 },
    { startDie: 7, endDie: 9, location: 'body', damageModifier: 2 },
    { startDie: 10, endDie: 10, location: 'head', damageModifier: 3 },
  ],
  [HIT_LOCATIONS.serpentine]: [
    { startDie: 1, endDie: 2, location: 'lowerBody', damageModifier: -1 },
    { startDie: 3, endDie: 6, location: 'middle', damageModifier: 0 },
    { startDie: 7, endDie: 9, location: 'upperBody', damageModifier: 2 },
    { startDie: 10, endDie: 10, location: 'head', damageModifier: 3 },
  ],
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CREATURE_TYPE {
  none = 'none',
  guardian = 'guardian',
  aberration = 'aberration',
  synthetic = 'synthetic',
  localFauna = 'localFauna',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CREATURE_SIZE {
  none = 'none',
  rodent = 'rodent',
  dog = 'dog',
  humanoid = 'humanoid',
  largeGorilla = 'largeGorilla',
  cow = 'cow',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CREATURE_DRIVE {
  none = 'none',
  territoryControl = 'territoryControl',
  predation = 'predation',
  destruction = 'destruction',
  parasitization = 'parasitization',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CREATURE_INTELLIGENCE {
  none = 'none',
  animalLike = 'animalLike',
  humanLike = 'humanLike',
  aboveHuman = 'aboveHuman',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CREATURE_ROLE {
  none = 'none',
  brute = 'brute',
  lurker = 'lurker',
  ranged = 'ranged',
  swarm = 'swarm',
  psychic = 'psychic',
}
