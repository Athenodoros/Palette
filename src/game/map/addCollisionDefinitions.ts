import { PLAYER_JUMP_STATE } from "../types";
import { OBJECT_GROUP_OBJECT, OBJECT_TYPE } from "./types";

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
      (_player.body as any).prev.y + _player.body.height / 2 <=
      _platform.body.top + 1
  );

  // Wall Interactions
  physics.add.collider(player, objects[OBJECT_TYPE.WALL]);

  // Star Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.STAR], (_, star) =>
    star.destroy()
  );

  // Gem Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.GEM], (_player, gem) => {
    _player.data.set("colour", gem.data.get("colour"));
    gem.destroy();
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
  physics.add.collider(player, objects[OBJECT_TYPE.LOCK]);
};
