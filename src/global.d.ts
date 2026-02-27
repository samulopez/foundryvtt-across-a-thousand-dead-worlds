import type ATDWActor from './module/actor/actor';
import type {
  CreatureDataModel,
  DeepDiverDataModel,
  NPCDataModel,
  MissionDataModel,
  SiteExpeditionDataModel,
} from './module/data';

declare module 'fvtt-types/configuration' {
  interface DataModelConfig {
    Actor: {
      creature: typeof CreatureDataModel;
      deepDiver: typeof DeepDiverDataModel;
      mission: typeof MissionDataModel;
      npc: typeof NPCDataModel;
      siteExpedition: typeof SiteExpeditionDataModel;
    };
  }

  interface DocumentClassConfig {
    Actor: typeof ATDWActor<Actor.SubType>;
  }

  interface ConfiguredActor<SubType extends Actor.SubType> {
    document: ATDWActor<SubType>;
  }
}

declare global {
  interface Game extends foundry.Game {
    dice3d?: {
      waitFor3DAnimationByMessageID: (messageId: string | null) => Promise<void>;
    };
  }
}
