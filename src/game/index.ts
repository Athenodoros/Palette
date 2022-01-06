import * as Phaser from "phaser";
import { LevelScene } from "./LevelScene";
import { SplashScene } from "./SplashScene";
import { DEBUG } from "./types";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  scene: [SplashScene, LevelScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 },
      debug: DEBUG,
    },
  },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
