import { Game, GameConfig } from "./game";
import { LEVEL_SCENE_NAME } from "./game/types";
import "./style.css";

const game = new Game(GameConfig);
game.scene.start(LEVEL_SCENE_NAME, { level: 2 });

(window as any).game = game;
