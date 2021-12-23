import {
  COLOUR,
  PLAYER_COLOUR,
  PLAYER_COLOURS,
  PLAYER_JUMP_STATE,
} from "../types";
import { OBJECT_GROUP_OBJECT, OBJECT_TYPE } from "./types";

export const getWorldObjects = (
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  map: Phaser.Tilemaps.Tilemap
) => {
  let player =
    null as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  const objects = Object.keys(OBJECT_TYPE).reduce(
    (acc, val) =>
      isNaN(+val) ? acc : { ...acc, [val]: physics.add.staticGroup() },
    {}
  ) as OBJECT_GROUP_OBJECT;

  // Loop through all data and replace with Game Objects
  map.getLayer("items").data.forEach((row) =>
    row.forEach((entry) => {
      // index is 0 for empty tiles, or -1 for unspecified
      if (entry.index > 0) {
        // Get object details from rendered tile
        const tileset =
          map.tilesets[
            (map.tilesets.findIndex(
              (tileset) => tileset.firstgid > entry.index
            ) || map.tilesets.length) - 1
          ];
        const index = entry.index - tileset.firstgid;
        const type = ITEM_TYPES[tileset.name][index];

        // If not one of the interactible object types, skip processing
        if (!type) {
          if (!IGNORED_TILE_TYPES[tileset.name].includes(index))
            throw new Error("Unexpected tile!");
          else return;
        }

        // Wipe underlying tile from view
        entry.index = 0;

        if (type.type === OBJECT_TYPE.PLAYER) {
          const colour = type.colour as PLAYER_COLOUR;

          player = physics.add.sprite(
            0,
            0,
            "player",
            PLAYER_COLOURS[colour] + "_front.png"
          );

          player.setData({ colour, state: PLAYER_JUMP_STATE.BASE });
          player.setX(entry.pixelX + map.tileWidth / 2 + 1);
          player.setY(entry.pixelY + map.tileHeight - player.body.halfHeight);
          player.setCollideWorldBounds(true);
        } else {
          const game_object = objects[type.type].create(
            entry.pixelX + map.tileWidth / 2 + 1,
            entry.pixelY + map.tileHeight / 2 + 1,
            tileset.name,
            index
          );

          if (type.type === OBJECT_TYPE.PLATFORM) game_object.body.height = 1;
        }
      }
    })
  );

  if (!player) throw new Error("No player created!");

  return { objects, player };
};

const IGNORED_TILE_TYPES: Record<string, number[]> = {
  tiles: [182],
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
