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

export const LEVEL_SCENE_NAME = "LevelScene";
export const SWITCH_SCENE_NAME = "SwitchScene";
