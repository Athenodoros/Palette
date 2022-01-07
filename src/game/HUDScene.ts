import * as Phaser from "phaser";
import { HEIGHT, HUD_SCENE_NAME, WIDTH } from "./constants";
import { COLOUR, PLAYER_COLOUR, PLAYER_COLOURS } from "./types";

interface LevelState {
  colour: PLAYER_COLOUR;
  stars: number;
  allKeys: PLAYER_COLOUR[];
  keys: Set<PLAYER_COLOUR>;
}

export class HUDScene extends Phaser.Scene {
  private state!: LevelState;
  private number!: Phaser.GameObjects.Image;
  private avatar!: Phaser.GameObjects.Image;
  private keys!: Phaser.GameObjects.Image[];

  constructor() {
    super({ key: HUD_SCENE_NAME });
  }

  init({
    colour,
    keys,
  }: {
    colour: PLAYER_COLOUR;
    keys: PLAYER_COLOUR[];
  }): void {
    this.state = {
      colour,
      stars: 0,
      allKeys: keys,
      keys: new Set<PLAYER_COLOUR>(),
    };
  }

  preload(): void {
    this.load.atlas("hud", "assets/packs/hud.png", "assets/packs/hud.json");
    this.load.atlas(
      "itemAtlas",
      "assets/packs/items.png",
      "assets/packs/items.json"
    );
  }

  create(): void {
    this.cameras.cameras[0].setZoom(0.8);
    this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);

    this.add.rectangle(
      0,
      0,
      (PADDING +
        AVATAR_WIDTH +
        PADDING / 2 +
        STAR_WIDTH * 0.7 +
        NUMBER_WIDTH * 0.7 +
        PADDING +
        KEY_WIDTH * this.state.allKeys.length +
        (this.state.allKeys.length ? PADDING : 0)) *
        2,
      MIDPOINT * 4,
      0x000000,
      0.8
    );

    this.avatar = this.add.image(
      PADDING + AVATAR_WIDTH / 2,
      MIDPOINT,
      "hud",
      `hud_${PLAYER_COLOURS[this.state.colour]}Alt.png`
    );
    const star = this.add.image(
      PADDING + AVATAR_WIDTH + PADDING / 2 + (STAR_WIDTH * 0.7) / 2,
      MIDPOINT,
      "itemAtlas",
      "star.png"
    );
    star.setScale(0.7);
    this.number = this.add.image(
      PADDING +
        AVATAR_WIDTH +
        PADDING / 2 +
        STAR_WIDTH * 0.7 +
        (NUMBER_WIDTH * 0.7) / 2,
      MIDPOINT,
      "hud",
      `hud_${this.state.stars}.png`
    );
    this.number.setScale(0.7);

    this.keys = this.state.allKeys.map((colour, idx) =>
      this.add.image(
        PADDING +
          AVATAR_WIDTH +
          PADDING / 2 +
          STAR_WIDTH * 0.7 +
          NUMBER_WIDTH * 0.7 +
          PADDING +
          KEY_WIDTH * 0.9 * (idx + 1 / 2),
        MIDPOINT,
        "hud",
        `hud_key${COLOUR[colour][0]}${COLOUR[colour]
          .substr(1)
          .toLowerCase()}_disabled.png`
      )
    );
    this.keys.forEach((key) => key.setScale(0.9));
  }

  addStar(): void {
    this.state.stars += 1;
    this.number.setFrame(`hud_${this.state.stars}.png`);
  }

  addKey(colour: PLAYER_COLOUR): void {
    this.state.keys.add(colour);
    this.keys[this.state.allKeys.indexOf(colour)].setFrame(
      `hud_key${COLOUR[colour][0]}${COLOUR[colour].substr(1).toLowerCase()}.png`
    );
  }

  changeColour(colour: PLAYER_COLOUR): void {
    this.avatar.setFrame(`hud_${PLAYER_COLOURS[colour]}Alt.png`);
  }
}

const PADDING = 28;
const MIDPOINT = 40;

const AVATAR_WIDTH = 48;
const STAR_WIDTH = 70;
const NUMBER_WIDTH = 32;
const KEY_WIDTH = 44;
