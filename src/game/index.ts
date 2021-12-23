import * as Phaser from "phaser";
import { DemoScene } from "./scene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  scene: [DemoScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 },
      debug: true,
    },
  },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
