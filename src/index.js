import Phaser from "phaser";
import PlayScene from "./scenes/playScene";
import SpaceScene from "./scenes/spaceScene";

const WIDTH = 1000;
const HEIGHT = 600;
const BIRD_POS = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPos: BIRD_POS,
};

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  // scene: [new PlayScene(SHARED_CONFIG)],
  scene: [new SpaceScene(SHARED_CONFIG)],
};

new Phaser.Game(config);
