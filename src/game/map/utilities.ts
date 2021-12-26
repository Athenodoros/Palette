import * as Phaser from "phaser";
import { COLOUR, PLAYER_COLOUR } from "../types";
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
  const platform = button.scene.physics.world.staticBodies.entries.find(
    (entry) =>
      entry.gameObject.getData("type") === OBJECT_TYPE.PLATFORM &&
      entry.top < button.y + button.height &&
      entry.bottom > button.y &&
      entry.left <= button.x &&
      entry.right >= button.x
  );

  if (platform === undefined) throw new Error("Platform missing for button!");

  let platforms = [platform];
  for (const left of [true, false]) {
    const additions = [platform];

    while (true) {
      const next = button.scene.physics.world.staticBodies.entries.find(
        (entry) =>
          entry.gameObject.getData("type") === OBJECT_TYPE.PLATFORM &&
          entry.top === additions[0].top &&
          entry.bottom === additions[0].bottom &&
          entry.left === additions[0].left + (left ? -70 : 70) &&
          entry.right === additions[0].right + (left ? -70 : 70)
      );

      if (
        next === undefined ||
        next.gameObject.getData("colourA") !==
          additions[0].gameObject.getData("colourA") ||
        additions[0].gameObject.getData("subtype") ===
          (left ? "start" : "end") ||
        next.gameObject.getData("subtype") === (left ? "end" : "start")
      )
        break;
      else additions.unshift(next);
    }

    additions.pop();

    platforms = platforms.concat(additions);
  }

  const platformColour =
    newState === "up"
      ? platform.gameObject.getData("colourA")
      : button.getData("colour");
  platforms.forEach(({ gameObject }) => {
    gameObject.setData("colour", platformColour);
    (gameObject as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).setFrame(
      PLATFORM_FRAMES[platformColour as keyof typeof PLATFORM_FRAMES][
        gameObject.getData("subtype") as "start" | "center" | "end"
      ]
    );
  });
};
