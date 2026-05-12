import {
  SITE_ACTIVITY,
  SITE_DESCRIPTOR,
  SITE_HAZARD,
  SITE_ORIGINAL_PURPOSE,
  SITE_PLANETARY_DESCRIPTOR,
  SITE_REQUIRED_SUIT,
  SITE_SIZE,
  SITE_STORY,
} from '../../constants';

import { sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

const { ArrayField, DocumentUUIDField, NumberField, SchemaField, StringField } = foundry.data.fields;

export const defineSiteExpeditionModel = () => ({
  size: new StringField({
    choices: SITE_SIZE,
    initial: SITE_SIZE.none,
  }),
  requiredSuit: new StringField({
    choices: SITE_REQUIRED_SUIT,
    initial: SITE_REQUIRED_SUIT.none,
  }),
  originalPurpose: new StringField({
    choices: SITE_ORIGINAL_PURPOSE,
    initial: SITE_ORIGINAL_PURPOSE.none,
  }),
  story: new StringField({
    choices: SITE_STORY,
    initial: SITE_STORY.none,
  }),
  descriptor: new StringField({
    choices: SITE_DESCRIPTOR,
    initial: SITE_DESCRIPTOR.none,
  }),
  planetaryDescriptor: new StringField({
    choices: SITE_PLANETARY_DESCRIPTOR,
    initial: SITE_PLANETARY_DESCRIPTOR.none,
  }),
  activity: new StringField({
    choices: SITE_ACTIVITY,
    initial: SITE_ACTIVITY.none,
  }),
  hazard: new StringField({
    choices: SITE_HAZARD,
    initial: SITE_HAZARD.none,
  }),
  resources: new SchemaField({
    value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    discovered: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  }),
  artifacts: new SchemaField({
    value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    discovered: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  }),
  dataCrystals: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  alloyCubes: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
  xenoanthropologicalArtifacts: new ArrayField(new StringField({ initial: '' })),
  encounters: new ArrayField(new DocumentUUIDField({ type: 'Actor', required: false })),
  timer: new NumberField({ required: true, integer: true, min: 0, initial: 0, max: 6 }),
  randomEncounters: new NumberField({ required: true, integer: true, min: 0, initial: 0, max: 6 }),
  ...sortingField(),
});

type SiteExpeditionModelSchema = ReturnType<typeof defineSiteExpeditionModel>;

export default class SiteExpeditionDataModel extends foundry.abstract.TypeDataModel<
  SiteExpeditionModelSchema,
  ATDWActor<'siteExpedition'>
> {
  static defineSchema(): SiteExpeditionModelSchema {
    return defineSiteExpeditionModel();
  }
}
