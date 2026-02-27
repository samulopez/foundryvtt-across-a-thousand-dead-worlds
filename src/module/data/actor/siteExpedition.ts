import { sortingField } from './helper';

import type ATDWActor from '../../actor/actor';

export const defineSiteExpeditionModel = () => ({
  // TODO
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
