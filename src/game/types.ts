export enum COLOUR {
  BLUE,
  RED,
  GREEN,

  YELLOW,
  GREY,
}

export const PLAYER_COLOURS = {
  [COLOUR.GREEN]: "p1",
  [COLOUR.BLUE]: "p2",
  [COLOUR.RED]: "p3",
} as const;
export type PLAYER_COLOUR = keyof typeof PLAYER_COLOURS;

export enum PLAYER_JUMP_STATE {
  BASE,
  JUMPED,
}

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
