import { LEVEL_SCENE_NAME, SPLASH_SCENE_NAME } from "./types";

export class SplashScene extends Phaser.Scene {
  public started: boolean = false;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: SPLASH_SCENE_NAME });
  }

  preload(): void {
    this.load.image("splash", "assets/splash/SplashScreen.png");
  }

  create(): void {
    this.add.image(
      this.cameras.main.displayWidth / 2,
      this.cameras.main.displayHeight / 2,
      "splash"
    );
    const text = this.add.text(
      this.cameras.main.displayWidth * 0.5,
      this.cameras.main.displayHeight * 0.77,
      "PRESS START",
      { fontSize: "24px" }
    );
    text.x -= text.width / 2;
    flashTextOpacity(text);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => this.scene.start(LEVEL_SCENE_NAME, { level: 1 })
    );
  }

  update(): void {
    if (this.cursors.space.isDown && !this.started) {
      this.started = true;
      this.cameras.main.fadeOut(500, 0, 0, 0);
    }
  }

  //   init(): void {
  //     this.level = level;
  //   }

  //   create(): void {
  //     this.scene.start(LEVEL_SCENE_NAME, { level: this.level });
  //   }
}

const flashTextOpacity = (text: Phaser.GameObjects.Text) => {
  text.scene.tweens.timeline({
    tweens: [
      {
        targets: text,
        duration: 0,
        alpha: 0,
        ease: "Linear",
      },
      {
        targets: text,
        duration: 500,
        alpha: 1,
        ease: "Linear",
      },
      {
        targets: text,
        duration: 500,
        alpha: 1,
        ease: "Linear",
      },
      {
        targets: text,
        duration: 500,
        alpha: 0,
        ease: "Linear",
        onComplete: () => flashTextOpacity(text),
      },
    ],
  });
};
