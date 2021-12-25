import { COLOUR, PLAYER_COLOUR, PLAYER_JUMP_STATE } from "../types";
import { OBJECT_GROUP_OBJECT, OBJECT_TYPE } from "./types";
import { resetGemFrames } from "./utilities";

export const addCollisionDefinitions = (
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  objects: OBJECT_GROUP_OBJECT
) => {
  // Platform Collisions
  physics.add.collider(
    player,
    objects[OBJECT_TYPE.PLATFORM],
    (_player) => _player.setData("state", PLAYER_JUMP_STATE.BASE),
    (_player, _platform) =>
      [COLOUR.GREY, _player.getData("colour")].includes(
        _platform.getData("colour")
      ) &&
      (_player.body as any).prev.y + _player.body.height / 2 <=
        _platform.body.top + 1
  );

  // Wall Interactions
  physics.add.collider(player, objects[OBJECT_TYPE.WALL]);

  // Star Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.STAR], (_player, star) => {
    _player.data.values.stars += 1;
    star.destroy();
  });

  // Gem Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.GEM], (_player, gem) => {
    const colour = gem.data.get("colour") as PLAYER_COLOUR;
    _player.data.set("colour", colour);
    resetGemFrames(colour, objects[OBJECT_TYPE.GEM]);
  });

  // Key Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.KEY], (_, key) =>
    key.destroy()
  );

  // Flag Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.FLAG], (_, flag) =>
    flag.destroy()
  );

  // Lock interactions
  physics.add.collider(
    player,
    objects[OBJECT_TYPE.LOCK],
    undefined,
    (_player, _lock) =>
      [_lock.getData("colourA"), _lock.getData("colourB")].includes(
        _player.getData("colour")
      )
  );
};
