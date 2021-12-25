import * as Phaser from "phaser";
import { COLOUR, PLAYER_COLOUR } from "../types";

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
