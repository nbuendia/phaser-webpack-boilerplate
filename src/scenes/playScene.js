import Phaser from "phaser";

const renderPipes = 4;
// const gravity = 500;
// const flapVelocity = 200;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;

    this.pipeOpeningRange = [100, 250];
    this.pipeSpacingRange = [400, 500];

    this.gravity = 500;
    this.flapVelocity = 200;

    this.score = 0;
    this.scoreText = "";
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.handleInputs();
    this.scoreUI();
  }

  update() {
    this.playerStatus();
    this.pipeRecycle();
  }

  //CREATE FUNCTIONS(4)
  createBG() {
    //x, y, image key
    this.background = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.background.displayWidth = this.sys.canvas.width;
    this.background.displayHeight = this.sys.canvas.height;
  }

  createBird() {
    //must add .physics if you want to access physics on object
    //gravity speeds up vs velocity stays constant
    this.bird = this.physics.add
      .sprite(this.config.startPos.x, this.config.startPos.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = this.gravity;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    //groups pipes into array
    this.pipes = this.physics.add.group();

    //pipe setting
    for (let i = 0; i < renderPipes; i++) {
      let pipeTop = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      let pipeBottom = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.pipePlacment(pipeTop, pipeBottom);
    }

    //can easily set vilocity on all pipes b/c of group property
    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    //collider(OBJ1, OBJ2, CALLBACKFUNC, null, PROCESS CALLBACK ON)
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  scoreUI() {
    // this.score = 0;
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: "25px",
      fill: "black",
    });
  }

  scoreIncrease() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  handleInputs() {
    //space input funciton
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }

  //UPDATE FUNCTIONS(1)
  playerStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  pipePlacment(top, bottom) {
    const rightMostPipe = this.getRightMostPipe();
    const pipeOpening = Phaser.Math.Between(...this.pipeOpeningRange);
    const pipePos = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeOpening
    );
    const pipeSpacing = Phaser.Math.Between(...this.pipeSpacingRange);

    top.x = rightMostPipe + pipeSpacing;
    top.y = pipePos;

    bottom.x = top.x;
    bottom.y = top.y + pipeOpening;
  }

  pipeRecycle() {
    const outOfBoundsPipes = [];

    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        outOfBoundsPipes.push(pipe);

        if (outOfBoundsPipes.length === 2) {
          this.pipePlacment(...outOfBoundsPipes);
          this.scoreIncrease();
        }
      }
    });
  }

  getRightMostPipe() {
    let rightMost = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMost = Math.max(pipe.x, rightMost);
    });

    return rightMost;
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
    this.score = 0;
  }
}

export default PlayScene;
