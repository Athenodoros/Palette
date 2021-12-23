export class DemoScene extends Phaser.Scene {
  public map!: Phaser.Tilemaps.Tilemap;
  public player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "DemoScene" });
  }

  preload(): void {
    this.load.tilemapTiledJSON("level1", "assets/levels/level1.json");

    this.load.spritesheet(
      "bg_castle_expanded",
      "assets/sprites/Misc/bg_castle_expanded.png",
      { frameWidth: 280, frameHeight: 280 }
    );
    this.load.spritesheet("flags", "assets/packs/flags.png", {
      frameWidth: 72,
      frameHeight: 142,
    });
    this.load.spritesheet("items", "assets/packs/items.png", {
      frameWidth: 72,
      frameHeight: 72,
    });
    this.load.spritesheet("tiles", "assets/packs/tiles.png", {
      frameWidth: 72,
      frameHeight: 72,
    });

    // this.load.atlas(
    //   "flags",
    //   "assets/packs/flags.png",
    //   "assets/packs/flags.json"
    // );
    // this.load.atlas("hud", "assets/packs/hud.png", "assets/packs/hud.json");
    // this.load.atlas(
    //   "items",
    //   "assets/packs/items.png",
    //   "assets/packs/items.json"
    // );
    this.load.atlas(
      "player",
      "assets/packs/player.png",
      "assets/packs/player.json"
    );
    this.load.atlas(
      "tilesAtlas",
      "assets/packs/tiles.png",
      "assets/packs/tiles.json"
    );
  }

  create(): void {
    this.map = this.make.tilemap({ key: "level1" });
    (window as any).map = this.map;
    (window as any).scene = this;

    const tilesets = TILESETS.map((name) => this.map.addTilesetImage(name));

    this.add.tileSprite(
      this.map.widthInPixels / 2,
      this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels,
      "bg_castle_expanded"
    );

    const itemLayer = this.map.createLayer("items", tilesets);

    this.cameras.cameras[0].setZoom(0.7);
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    const help = this.add.text(16, 16, "Arrow keys to scroll", {
      fontSize: "18px",
      padding: { x: 10, y: 5 },
      backgroundColor: "#000000",
      color: "#ffffff",
    });
    help.setScrollFactor(0);

    this.physics.world.bounds.width = itemLayer.width;
    this.physics.world.bounds.height = itemLayer.height;

    // Initialise Objects
    // const platforms = this.physics.add.staticGroup();

    // const createTileObjects = (index: number, atlas: string, sprite: string) =>
    //   this.map.createFromTiles(index, 0, {}).forEach((object) => {
    //     object.x += this.map.tileWidth / 2 + 1;
    //     object.y += this.map.tileHeight / 2 + 1;
    //     object.setTexture(atlas, sprite);
    //     this.physics.world.enableBody(
    //       object,
    //       Phaser.Physics.Arcade.STATIC_BODY
    //     );
    //   });

    // // map.tilesets[2].firstgid
    // // map.getLayer("items").data[3][11].index
    // // scene.textures
    // // map.getLayer("items").data[3][11].index = 0

    // createTileObjects(16, "tilesAtlas", "blueStoneMid.png");
    // createTileObjects(4, "tilesAtlas", "blueStoneCliffLeft.png");
    // createTileObjects(6, "tilesAtlas", "blueStoneCliffRight.png");
    // createTileObjects(54, "tilesAtlas", "castleLeft.png");
    // createTileObjects(55, "tilesAtlas", "castleMid.png");
    // createTileObjects(56, "tilesAtlas", "castleRight.png");

    const { platforms, walls } = this.initialiseObjects();

    const player_loc = this.map.getObjectLayer("level").objects[0];
    const player = this.physics.add.sprite(
      player_loc.x!,
      player_loc.y!,
      "player",
      "p1_front.png"
    );
    // player.setMaxVelocity(0);
    player.setCollideWorldBounds(true);
    this.player = player;

    this.physics.add.collider(
      player,
      platforms,
      undefined,
      (_player, _platform) =>
        (_player.body as any).prev.y + _player.body.height <=
        _platform.body.top + 1
    );
    this.physics.add.collider(player, walls);

    this.cameras.main.centerOn(player.x, player.y);

    // const ground = this.map.getObjectLayer("ground").objects[0];
    // this.physics.add.(ground.x, ground.y)

    // this.
  }

  private initialiseObjects() {
    const platforms = this.physics.add.staticGroup();
    const walls = this.physics.add.staticGroup();

    this.map.getLayer("items").data.forEach((entries, row) =>
      entries.forEach((entry, column) => {
        if (entry.index !== 0) {
          const tileset = this.map.tilesets.find(
            (tileset) => tileset.firstgid <= 16
          )!;
          const object = ITEM_TYPES[tileset.name as TILESET][entry.index - 1];
          const index = entry.index - tileset.firstgid;

          const x = entry.pixelX + this.map.tileWidth / 2 + 1;
          const y = entry.pixelY + this.map.tileHeight / 2 + 1;

          switch (object?.type) {
            case OBJECT_TYPE.PLATFORM:
              const platform = platforms.create(x, y, tileset.name, index);
              platform.body.height = 1;
              break;
            case OBJECT_TYPE.WALL:
              walls.create(x, y, tileset.name, index);
            default:
              console.log("Incorrect index...");
          }

          // Eventually, remove conditional
          if (object) entry.index = 0;
        }
      })
    );

    return { platforms, walls };
  }

  update(_: any, delta: number): void {
    if (this.cursors.up.isDown) this.player.setVelocityY(-600);

    if (this.cursors.left.isDown) this.player.setVelocityX(-450);
    else if (this.cursors.right.isDown) this.player.setVelocityX(450);
    else this.player.setVelocityX(0);

    this.cameras.main.centerOn(this.player.x, this.player.y);
  }
}

const TILESETS = ["items", "tiles"] as const;
type TILESET = typeof TILESETS[number];

enum COLOUR {
  BLUE,
  RED,
  GREEN,

  YELLOW,
  GREY,
}
enum OBJECT_TYPE {
  PLATFORM,
  WALL,
}

const ITEM_TYPES: Record<
  TILESET,
  Record<
    number,
    | { type: OBJECT_TYPE; subtype?: string; colour?: COLOUR; colour2?: COLOUR }
    | undefined
  >
> = {
  items: {},
  tiles: {
    3: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "start",
      colour: COLOUR.BLUE,
    },
    15: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "center",
      colour: COLOUR.BLUE,
    },
    5: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "end",
      colour: COLOUR.BLUE,
    },
    53: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "start",
      colour: COLOUR.GREY,
    },
    40: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "start",
      colour: COLOUR.GREY,
    },
    54: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "center",
      colour: COLOUR.GREY,
    },
    55: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "end",
      colour: COLOUR.GREY,
    },
    42: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "end",
      colour: COLOUR.GREY,
    },
    139: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "start",
      colour: COLOUR.RED,
    },
    151: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "center",
      colour: COLOUR.RED,
    },
    141: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "end",
      colour: COLOUR.RED,
    },
    38: {
      type: OBJECT_TYPE.WALL,
    },
  },
};
