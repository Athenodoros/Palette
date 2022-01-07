import {
  COLOUR,
  DEBUG,
  PLAYER_COLOUR,
  PLAYER_COLOURS,
  PLAYER_JUMP_STATE,
} from "../types";
import { OBJECT_GROUP_OBJECT, OBJECT_TYPE } from "./types";
import { resetGemFrames } from "./utilities";

export const getWorldObjects = (
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  map: Phaser.Tilemaps.Tilemap
) => {
  let player_details = null as {
    colour: PLAYER_COLOUR;
    x: number;
    y: number;
  } | null;
  const keys: PLAYER_COLOUR[] = [];

  const objects = Object.keys(OBJECT_TYPE).reduce(
    (acc, val) =>
      isNaN(+val) ? acc : { ...acc, [val]: physics.add.staticGroup() },
    {}
  ) as OBJECT_GROUP_OBJECT;

  // Loop through all data and replace with Game Objects
  map.getLayer("level").data.forEach((row) =>
    row.forEach((entry) => {
      // index is 0 for empty tiles, or -1 for unspecified
      if (entry.index > 0) {
        // Get object details from rendered tile
        const tileset = findPreviousValueOrLast(
          map.tilesets,
          (t) => t.firstgid > entry.index
        );

        let index = entry.index - tileset.firstgid;
        if (
          REPLACEMENTS[tileset.name] &&
          REPLACEMENTS[tileset.name][index] !== undefined
        )
          index = REPLACEMENTS[tileset.name][index];

        const type = ITEM_TYPES[tileset.name][index];

        // If not one of the interactible object types, skip processing
        if (!type) {
          if (!IGNORED_TILE_TYPES[tileset.name].includes(index))
            throw new Error(`Unexpected tile: ${tileset.name}/${index}`);
          else return;
        }

        // Wipe underlying tile from view
        entry.index = 0;

        if (type.type === OBJECT_TYPE.PLAYER) {
          player_details = {
            colour: type.colour as PLAYER_COLOUR,
            x: entry.pixelX,
            y: entry.pixelY,
          };
        } else {
          const game_object = objects[type.type].create(
            entry.pixelX + map.tileWidth / 2 + 1,
            entry.pixelY + map.tileHeight / 2 + 1,
            tileset.name,
            index
          ) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
          game_object.setData(type);

          if (DEBUG) {
            game_object.setInteractive();
            game_object.on("pointerdown", () => console.log(game_object));
          }

          if (type.type === OBJECT_TYPE.PLATFORM) {
            game_object.body.height = 1;
            game_object.setData("colourA", game_object.getData("colour")); // Cache for buttons
          }
          if (type.type === OBJECT_TYPE.KEY)
            keys.push(type.colour as PLAYER_COLOUR);
          if (type.type === OBJECT_TYPE.BUTTON) {
            game_object.setBounce(0.6);
            game_object.body.height = 1;
            game_object.body.width = 30;
            game_object.body.x += 70 / 2 - 30 / 2;
            game_object.body.y += 25;
          }
        }
      }
    })
  );

  if (player_details === null) {
    throw new Error("No player created!");
  }

  const player = physics.add.sprite(
    0,
    0,
    "player",
    PLAYER_COLOURS[player_details.colour] + "_front.png"
  );
  player.setData({
    colour: player_details.colour,
    state: PLAYER_JUMP_STATE.BASE,
    stars: 0,
    keys: new Set(),
  });
  player.setX(player_details.x + map.tileWidth / 2 + 1);
  player.setY(player_details.y + map.tileHeight - player.body.halfHeight);
  player.setCollideWorldBounds(true);

  resetGemFrames(player_details.colour, objects[OBJECT_TYPE.GEM]);

  return { objects, player, hud: { colour: player_details.colour, keys } };
};

const findPreviousValueOrLast = <T>(
  array: T[],
  predicate: (t: T) => boolean
) => {
  const index = array.findIndex(predicate);
  return array[(index === -1 ? array.length : index) - 1];
};

const IGNORED_TILE_TYPES: Record<string, number[]> = {
  tiles: [182],
  items: [],
};

const REPLACEMENTS: Record<string, Record<number, number>> = {
  tiles: {
    40: 53,
    42: 55,
  },
};

const ITEM_TYPES: Record<
  string,
  Record<
    number,
    | {
        type: OBJECT_TYPE;
        subtype?: string;
        colour?: COLOUR;
        colourA?: COLOUR;
        colourB?: COLOUR;
      }
    | undefined
  >
> = {
  items: {
    3: {
      type: OBJECT_TYPE.BUTTON,
      subtype: "up",
      colour: COLOUR.BLUE,
    },
    4: {
      type: OBJECT_TYPE.BUTTON,
      subtype: "down",
      colour: COLOUR.BLUE,
    },
    5: {
      type: OBJECT_TYPE.BUTTON,
      subtype: "up",
      colour: COLOUR.GREEN,
    },
    6: {
      type: OBJECT_TYPE.BUTTON,
      subtype: "down",
      colour: COLOUR.GREEN,
    },
    7: {
      type: OBJECT_TYPE.BUTTON,
      subtype: "up",
      colour: COLOUR.RED,
    },
    9: {
      type: OBJECT_TYPE.BUTTON,
      subtype: "down",
      colour: COLOUR.RED,
    },
    20: {
      type: OBJECT_TYPE.FLAG,
      colour: COLOUR.BLUE,
    },
    21: {
      type: OBJECT_TYPE.PLAYER,
      colour: COLOUR.BLUE,
    },
    23: {
      type: OBJECT_TYPE.FLAG,
      colour: COLOUR.GREEN,
    },
    24: {
      type: OBJECT_TYPE.PLAYER,
      colour: COLOUR.GREEN,
    },
    28: {
      type: OBJECT_TYPE.FLAG,
      colour: COLOUR.RED,
    },
    29: {
      type: OBJECT_TYPE.PLAYER,
      colour: COLOUR.RED,
    },
    31: {
      type: OBJECT_TYPE.FLAG,
      colour: COLOUR.YELLOW,
    },
    38: {
      type: OBJECT_TYPE.GEM,
      colour: COLOUR.BLUE,
    },
    39: {
      type: OBJECT_TYPE.GEM,
      colour: COLOUR.GREEN,
    },
    40: {
      type: OBJECT_TYPE.GEM,
      colour: COLOUR.RED,
    },
    42: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.BLUE,
    },
    43: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.BLUE,
    },
    45: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.GREEN,
    },
    46: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.RED,
      colourB: COLOUR.BLUE,
    },
    47: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.RED,
      colourB: COLOUR.GREEN,
    },
    48: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.RED,
      colourB: COLOUR.RED,
    },
    49: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.BLUE,
      colourA: COLOUR.YELLOW,
      colourB: COLOUR.YELLOW,
    },
    50: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.BLUE,
    },
    51: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.BLUE,
    },
    52: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.GREEN,
    },
    54: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.RED,
      colourB: COLOUR.BLUE,
    },
    55: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.RED,
      colourB: COLOUR.GREEN,
    },
    56: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.RED,
      colourB: COLOUR.RED,
    },
    57: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.GREEN,
      colourA: COLOUR.YELLOW,
      colourB: COLOUR.YELLOW,
    },
    58: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.BLUE,
    },
    59: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.GREEN,
    },
    60: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.RED,
    },
    61: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.GREEN,
    },
    63: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.RED,
    },
    64: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.RED,
      colourB: COLOUR.RED,
    },
    65: {
      type: OBJECT_TYPE.KEY,
      colour: COLOUR.RED,
      colourA: COLOUR.YELLOW,
      colourB: COLOUR.YELLOW,
    },
    53: {
      type: OBJECT_TYPE.STAR,
    },
  },
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
    105: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "start",
      colour: COLOUR.GREEN,
    },
    107: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "end",
      colour: COLOUR.GREEN,
    },
    116: {
      type: OBJECT_TYPE.PLATFORM,
      subtype: "center",
      colour: COLOUR.GREEN,
    },
    128: {
      type: OBJECT_TYPE.LOCK,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.BLUE,
    },
    129: {
      type: OBJECT_TYPE.LOCK,
      colourA: COLOUR.BLUE,
      colourB: COLOUR.RED,
    },
    130: {
      type: OBJECT_TYPE.LOCK,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.GREEN,
    },
    131: {
      type: OBJECT_TYPE.LOCK,
      colourA: COLOUR.GREEN,
      colourB: COLOUR.BLUE,
    },
    132: {
      type: OBJECT_TYPE.LOCK,
      colourA: COLOUR.RED,
      colourB: COLOUR.RED,
    },
    133: {
      type: OBJECT_TYPE.LOCK,
      colourA: COLOUR.RED,
      colourB: COLOUR.GREEN,
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
