import { Game, GameConfig } from "./game";
import "./style.css";

// const app = document.querySelector<HTMLDivElement>("#app")!;

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `;

(window as any).game = new Game(GameConfig);
