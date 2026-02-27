import { SORTING } from '../../constants';

const { NumberField, SchemaField, StringField } = foundry.data.fields;

const attributeField = (initial: number) =>
  new SchemaField({
    value: new NumberField({ required: true, integer: true, min: 0, initial, max: 18 }),
    temporaryModifier: new NumberField({ integer: true }),
  });

export const sortingField = () => ({
  sorting: new StringField({
    choices: [SORTING.alphabetically, SORTING.manually],
    initial: SORTING.manually,
  }),
});

export const primaryAttributes = new SchemaField({
  strength: attributeField(8),
  dexterity: attributeField(8),
  constitution: attributeField(8),
  will: attributeField(8),
  intelligence: attributeField(8),
  charisma: attributeField(8),
});

export const skillField = (initial: number) =>
  new SchemaField({
    value: new NumberField({ required: true, integer: true, initial, max: 15 }),
    temporaryModifier: new NumberField({ integer: true }),
  });
