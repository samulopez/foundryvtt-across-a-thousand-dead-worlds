import { defineItemModel } from './gear';

import type { GearModelSchema } from './gear';
import type ATDWItem from '../../item/item';

const { NumberField } = foundry.data.fields;

const defineAugmentationModel = () => ({
  strain: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
});

type AugmentationModelSchema = ReturnType<typeof defineAugmentationModel> & GearModelSchema;

export default class AugmentationDataModel extends foundry.abstract.TypeDataModel<
  AugmentationModelSchema,
  ATDWItem<'augmentation'>
> {
  static defineSchema(): AugmentationModelSchema {
    return { ...defineItemModel(), ...defineAugmentationModel() };
  }

  slots(): number {
    return 0;
  }
}
