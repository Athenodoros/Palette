import { COLOUR, PLAYER_COLOUR } from "../types";
import { OBJECT_GROUP_OBJECT, OBJECT_TYPE } from "./types";
import { flipButton, resetGemFrames } from "./utilities";

export const addCollisionDefinitions = (
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  objects: OBJECT_GROUP_OBJECT,
  transition: () => void
) => {
  // Platform Collisions
  physics.add.collider(
    player,
    objects[OBJECT_TYPE.PLATFORM],
    undefined,
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
  physics.add.overlap(
    player,
    objects[OBJECT_TYPE.KEY],
    (_player, _key) => {
      (_player.data.values.keys as Set<PLAYER_COLOUR>).add(
        _key.getData("colour")
      );
      _key.destroy();
    },
    (_player, _key) =>
      [_key.getData("colourA"), _key.getData("colourB")].includes(
        _player.getData("colour")
      )
  );

  // Flag Pickups
  physics.add.overlap(
    player,
    objects[OBJECT_TYPE.FLAG],
    (_, flag) => {
      transition();
      flag.destroy();
    },
    (_player, _flag) =>
      [_player.getData("colour"), COLOUR.YELLOW].includes(
        _flag.getData("colour")
      )
  );

  // Lock interactions
  physics.add.collider(
    player,
    objects[OBJECT_TYPE.LOCK],
    undefined,
    (_player, _lock) =>
      [_lock.getData("colourA"), _lock.getData("colourB")].includes(
        _player.getData("colour")
      ) &&
      !(_player.getData("keys") as Set<PLAYER_COLOUR>).has(
        _player.getData("colour")
      )
  );

  // Button interactions
  physics.add.collider(
    player,
    objects[OBJECT_TYPE.BUTTON],
    (_, _button) => {
      flipButton(_button as Phaser.Types.Physics.Arcade.SpriteWithStaticBody);
    },
    (_player, _button) =>
      [COLOUR.GREY, _player.getData("colour")].includes(
        _button.getData("colour")
      ) &&
      (_player.body as any).prev.y + _player.body.height / 2 <=
        _button.body.top + 1
  );
};
