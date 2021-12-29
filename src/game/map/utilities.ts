import * as Phaser from "phaser";
import { COLOUR, PLAYER_COLOUR, TILE_SIZE } from "../types";
import { OBJECT_TYPE } from "./types";

const GEM_FRAMES = {
  [COLOUR.BLUE]: {
    glow: 38,
    base: 33,
  },
  [COLOUR.GREEN]: {
    glow: 39,
    base: 34,
  },
  [COLOUR.RED]: {
    glow: 40,
    base: 36,
  },
};
export const resetGemFrames = (
  colour: PLAYER_COLOUR,
  gems: Phaser.Physics.Arcade.StaticGroup
) =>
  gems.children.each((gem) => {
    (gem as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).setFrame(
      GEM_FRAMES[gem.getData("colour") as PLAYER_COLOUR][
        gem.getData("colour") === colour ? "base" : "glow"
      ]
    );
  });

const BUTTON_FRAMES = {
  [COLOUR.BLUE]: {
    up: 3,
    down: 4,
  },
  [COLOUR.GREEN]: {
    up: 5,
    down: 6,
  },
  [COLOUR.RED]: {
    up: 7,
    down: 9,
  },
};
const PLATFORM_FRAMES = {
  [COLOUR.BLUE]: {
    start: 3,
    center: 15,
    end: 5,
  },
  [COLOUR.GREY]: {
    start: 53,
    center: 54,
    end: 55,
  },
  [COLOUR.GREEN]: {
    start: 105,
    center: 116,
    end: 107,
  },
  [COLOUR.RED]: {
    start: 139,
    center: 151,
    end: 141,
  },
};
export const flipButton = (
  button: Phaser.Types.Physics.Arcade.SpriteWithStaticBody
) => {
  // Update Button
  const oldState = button.getData("subtype") as "up" | "down";
  const newState = oldState === "up" ? "down" : "up";

  button.setFrame(
    BUTTON_FRAMES[button.getData("colour") as PLAYER_COLOUR][newState]
  );
  button.setData("subtype", newState);
  button.body.y += (oldState === "up" ? 1 : -1) * 20;

  // Update Platform
  const platform = getObjectAt(
    button.body.world,
    button.x,
    button.y + TILE_SIZE + 1 - (button.y % TILE_SIZE),
    OBJECT_TYPE.PLATFORM
  );

  if (platform === undefined) throw new Error("Platform missing for button!");

  let platforms = [platform];
  for (const left of [true, false]) {
    const additions = [platform];

    while (true) {
      const next = getObjectAtOffset(
        additions[0],
        left ? -1 : 1,
        0,
        OBJECT_TYPE.PLATFORM
      );

      if (
        next === undefined ||
        next.getData("colourA") !== additions[0].getData("colourA") ||
        additions[0].getData("subtype") === (left ? "start" : "end") ||
        next.getData("subtype") === (left ? "end" : "start")
      )
        break;
      else additions.unshift(next);
    }

    additions.pop();

    platforms = platforms.concat(additions);
  }

  const platformColour =
    newState === "up" ? platform.getData("colourA") : button.getData("colour");
  platforms.forEach((gameObject) => {
    gameObject.setData("colour", platformColour);
    (gameObject as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).setFrame(
      PLATFORM_FRAMES[platformColour as keyof typeof PLATFORM_FRAMES][
        gameObject.getData("subtype") as "start" | "center" | "end"
      ]
    );
  });
};

export const activateFlag = (
  flag: Phaser.Types.Physics.Arcade.SpriteWithStaticBody
) => {
  activateFlagObject(flag);

  const connected =
    getObjectAtOffset(flag, 0, 1, OBJECT_TYPE.FLAG) ||
    getObjectAtOffset(flag, 0, -1, OBJECT_TYPE.FLAG);
  if (connected) activateFlagObject(flag);
};

const activateFlagObject = (
  flag: Phaser.Types.Physics.Arcade.SpriteWithStaticBody
) => {
  flag.play("flagfall");
  flag.body.checkCollision.none = true;
};

const getObjectAtOffset = (
  object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
  horizontal: number = 0,
  vertical: number = 0,
  type?: OBJECT_TYPE
) => {
  const { x, y } = getLocationWithOffset(object, horizontal, vertical);
  return getObjectAt(object.body.world, x, y, type);
};

const getLocationWithOffset = (
  object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
  horizontal: number = 0,
  vertical: number = 0
) => ({
  x: object.body.x + horizontal * TILE_SIZE + 1,
  y: object.body.y + vertical * TILE_SIZE + 1,
});

const getObjectAt = (
  world: Phaser.Physics.Arcade.World,
  x: number,
  y: number,
  type?: OBJECT_TYPE
) =>
  world.staticBodies.entries.find(
    (entry) =>
      (type === undefined || entry.gameObject.getData("type") === type) &&
      entry.top <= y &&
      entry.bottom >= y &&
      entry.left <= x &&
      entry.right >= x
  )?.gameObject as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
