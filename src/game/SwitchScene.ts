// This seems to be necessary because data is not passed to init()
//   when an instance of the same scene is already running.

import { LEVEL_SCENE_NAME, SWITCH_SCENE_NAME } from "./types";

export class SwitchScene extends Phaser.Scene {
  public level!: number;

  constructor() {
    super({ key: SWITCH_SCENE_NAME });
  }

  init({ level }: { level: number }): void {
    this.level = level;
  }

  create(): void {
    this.scene.start(LEVEL_SCENE_NAME, { level: this.level });
  }
}
