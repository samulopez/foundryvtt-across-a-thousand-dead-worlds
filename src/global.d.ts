import type ATDWActor from './module/actor/actor';
import type {
  CreatureDataModel,
  DeepDiverDataModel,
  GearDataModel,
  NPCDataModel,
  MissionDataModel,
  SiteExpeditionDataModel,
} from './module/data';
import type ATDWItem from './module/item/item';

declare module 'fvtt-types/configuration' {
  interface DataModelConfig {
    Actor: {
      creature: typeof CreatureDataModel;
      deepDiver: typeof DeepDiverDataModel;
      mission: typeof MissionDataModel;
      npc: typeof NPCDataModel;
      siteExpedition: typeof SiteExpeditionDataModel;
    };
    Item: {
      gear: typeof GearDataModel;
    };
  }

  interface DocumentClassConfig {
    Actor: typeof ATDWActor<Actor.SubType>;
    Item: typeof ATDWItem<Item.SubType>;
  }

  interface ConfiguredActor<SubType extends Actor.SubType> {
    document: ATDWActor<SubType>;
  }

  interface ConfiguredItem<SubType extends Item.SubType> {
    document: ATDWItem<SubType>;
  }
}

declare global {
  interface Game extends foundry.Game {
    dice3d?: {
      waitFor3DAnimationByMessageID: (messageId: string | null) => Promise<void>;
    };
  }
}
