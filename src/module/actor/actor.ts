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
