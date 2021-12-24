import { addCollisionDefinitions, getWorldObjects } from "./map";
import { PLAYER_COLOUR, PLAYER_COLOURS, PLAYER_JUMP_STATE } from "./types";

export class LevelScene extends Phaser.Scene {
  public map!: Phaser.Tilemaps.Tilemap;
  public player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {
    this.load.tilemapTiledJSON("level1", "assets/levels/level1.json");

    this.load.spritesheet(
      "background",
      "assets/sprites/Misc/bg_castle_expanded.png",
      { frameWidth: 280, frameHeight: 280 }
    );

    this.load.spritesheet("items", "assets/packs/items.png", {
      frameWidth: 72,
      frameHeight: 72,
    });
    this.load.spritesheet("tiles", "assets/packs/tiles.png", {
      frameWidth: 72,
      frameHeight: 72,
    });

    this.load.atlas(
      "player",
      "assets/packs/player.png",
      "assets/packs/player.json"
    );
  }

  create(): void {
    Object.values(PLAYER_COLOURS).forEach((colour) => {
      // The sprite's position changes if these aren't all the same size, causing flickering of the state
      // I think it should be fixed by player.setOrigin, but no permutation of inputs seems to work

      this.anims.create({
        key: colour + "Walk",
        frames: [...Array(11)].map((_, i) => ({
          key: "player",
          frame: `${colour}_walk${(i + 1 + "").padStart(2, "0")}.png`,
        })),
        frameRate: 12,
        repeat: -1,
      });
      this.anims.create({
        key: colour + "Stand",
        frames: [{ key: "player", frame: colour + "_walk10.png" }],
      });
      this.anims.create({
        key: colour + "Jump",
        frames: [{ key: "player", frame: colour + "_walk04.png" }],
      });
      this.anims.create({
        key: colour + "Fall",
        frames: [{ key: "player", frame: colour + "_walk03.png" }],
      });
    });

    this.map = this.make.tilemap({ key: "level1" });
    const width = this.map.widthInPixels;
    const height = this.map.heightInPixels;

    this.add.tileSprite(width / 2, height / 2, width, height, "background");
    this.map.createLayer("items", [
      this.map.addTilesetImage("items"),
      this.map.addTilesetImage("tiles"),
    ]);

    const { objects, player } = getWorldObjects(this.physics, this.map);
    this.player = player;
    addCollisionDefinitions(this.physics, player, objects);

    this.cameras.cameras[0].setZoom(0.7);
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.centerOn(player.x, player.y);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.bounds.width = width;
    this.physics.world.bounds.height = height;

    Object.assign(window, { player, map: this.map, scene: this });
  }

  update(): void {
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-600);
      this.player.setData("state", PLAYER_JUMP_STATE.JUMPED);
    }

    if (this.cursors.left.isDown) {
      this.player.setFlip(true, false);
      this.player.setVelocityX(-450);
    } else if (this.cursors.right.isDown) {
      this.player.setFlip(false, false);
      this.player.setVelocityX(450);
    } else {
      this.player.setVelocityX(0);
    }

    this.player.play(
      PLAYER_COLOURS[this.player.data.get("colour") as PLAYER_COLOUR] +
        (this.player.getData("state") === PLAYER_JUMP_STATE.JUMPED
          ? "Jump"
          : this.player.body.velocity.y > 10
          ? "Fall"
          : this.player.body.velocity.x !== 0
          ? "Walk"
          : "Stand"),
      true
    );

    this.cameras.main.centerOn(this.player.x, this.player.y);
  }
}
