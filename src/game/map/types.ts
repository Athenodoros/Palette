export enum OBJECT_TYPE {
  PLATFORM,
  WALL,
  STAR,
  PLAYER,
  GEM,
  KEY,
  FLAG,
  LOCK,
  BUTTON,
}
export type OBJECT_GROUP_OBJECT = Record<
  OBJECT_TYPE,
  Phaser.Physics.Arcade.StaticGroup
>;
