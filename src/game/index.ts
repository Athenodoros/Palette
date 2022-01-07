import * as Phaser from "phaser";
import { DEBUG, HEIGHT, WIDTH } from "./constants";
import { HUDScene } from "./HUDScene";
import { LevelScene } from "./LevelScene";
import { SplashScene } from "./SplashScene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "app",
  scene: [SplashScene, LevelScene, HUDScene],
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
