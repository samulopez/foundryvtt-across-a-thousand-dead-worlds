export default class ATDWItem<out SubType extends Item.SubType = Item.SubType> extends Item<SubType> {
  isGear(): this is ATDWItem<'gear'> {
    return this.type === 'gear';
  }
}
