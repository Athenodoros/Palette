import { HUDScene } from "../scenes/HUDScene";
import {
  COLOUR,
  OBJECT_GROUP_OBJECT,
  OBJECT_TYPE,
  PLAYER_COLOUR,
  PLAYER_JUMP_STATE,
} from "../types";
import { activateFlag, flipButton, resetGemFrames } from "./utilities";

export const addCollisionDefinitions = (
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  objects: OBJECT_GROUP_OBJECT,
  hud: HUDScene,
  transition: () => void
) => {
  // Platform Collisions
  physics.add.collider(
    player,
    objects[OBJECT_TYPE.PLATFORM],
    (_player) => {
      _player.setData("state", PLAYER_JUMP_STATE.BASE);
    },
    (_player, _platform) =>
      [COLOUR.GREY, _player.getData("colour")].includes(
        _platform.getData("colour")
      ) &&
      (_player.body as any).prev.y + _player.body.height <=
        _platform.body.top + 2 &&
      _player.body.y + _player.body.height >= _platform.body.top - 2
  );

  // Wall Interactions
  physics.add.collider(player, objects[OBJECT_TYPE.WALL]);

  // Star Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.STAR], (_player, star) => {
    _player.data.values.stars += 1;
    hud.addStar();
    star.destroy();
  });

  // Gem Pickups
  physics.add.overlap(player, objects[OBJECT_TYPE.GEM], (_player, gem) => {
    const colour = gem.data.get("colour") as PLAYER_COLOUR;
    _player.data.set("colour", colour);
    hud.changeColour(colour);
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
      hud.addKey(_key.getData("colour"));
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
      activateFlag(flag as Phaser.Types.Physics.Arcade.SpriteWithStaticBody);
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
    (_player, _lock) => {
      if (_player.body.bottom === _lock.body.top)
        _player.setData("state", PLAYER_JUMP_STATE.BASE);
    },
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
      _button.setData("time", new Date().getTime());
      flipButton(_button as Phaser.Types.Physics.Arcade.SpriteWithStaticBody);
    },
    (_player, _button) =>
      (!_button.getData("time") ||
        new Date().getTime() - _button.getData("time") >= 500) &&
      [COLOUR.GREY, _player.getData("colour")].includes(
        _button.getData("colour")
      ) &&
      (_player.body as any).prev.y + _player.body.height <=
        _button.body.top + 2 &&
      _player.body.y + _player.body.height >= _button.body.top
  );
};
