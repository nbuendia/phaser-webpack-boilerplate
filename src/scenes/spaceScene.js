import Phaser from "phaser";

class SpaceScene extends Phaser.Scene {
  constructor(config) {
    super("SpaceScene");
    this.config = config;

    //RANDOM METEOR SPAWN/VELOCITY
    this.yRange = [0, 550];
    this.velocityRange = [100, 400];
    this.meteorTimer;

    //RANDOM SPAWN VARIABLES
    this.delayRange = [500, 1500];
    this.powerupDelay = [10000, 30000];

    //********** UI **********//
    this.score = 0;
    this.scoreText = "";

    this.lives = 3;
    this.livesText = "";

    this.gameOverText = "";
    this.getReadyText = "";
    this.countdown = 3;
    this.countdownText = "";
    //********** UI **********//
  }

  preload() {
    this.load.image("mars", "assets/scifi_BG.png");
    this.load.image("meteor", "assets/meteor.png");
    this.load.image("spaceship", "assets/spaceship.png");
    this.load.image("missile", "assets/missile.png");

    this.load.image("enemy1", "assets/enemyShip1.png");
    this.load.image("enemy2", "assets/enemyShip2.png");
    this.load.image("enemy3", "assets/enemyShip3.png");
    this.load.image("enemy4", "assets/enemyShip4.png");

    this.load.spritesheet("heart", "assets/heart_powerup.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("star", "assets/star_powerup.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("shield", "assets/ship_shield2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.createBG();
    this.createSpaceship();
    this.meteorSpawner();
    this.enemyClusterSpawner();
    this.powerupSpawner();
    this.createColliders();
    this.UI();
  }

  update() {
    this.playerStatus();
    this.handleInputs();
  }

  createBG() {
    //x, y, image key
    this.background = this.add.image(0, 0, "mars").setOrigin(0, 0);
    this.background.displayWidth = this.sys.canvas.width;
    this.background.displayHeight = this.sys.canvas.height;
  }

  createColliders() {
    //collider(OBJ1, OBJ2, CALLBACKFUNC, null, PROCESS CALLBACK ON)
    this.physics.add.overlap(
      this.spaceship,
      this.meteors,
      this.onShipCollision,
      null,
      this
    );

    this.missiles = this.physics.add.group();
    this.physics.add.overlap(
      this.missiles,
      this.meteors,
      this.onMissileMeteorCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.spaceship,
      this.enemies,
      this.onEnemyCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.missiles,
      this.enemies,
      this.onMissileEnemyCollision,
      null,
      this
    );

    this.physics.add.collider(
      this.enemies,
      this.enemies,
      this.onEnemySelfCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.spaceship,
      this.hearts,
      this.onHeartPowerupCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.spaceship,
      this.stars,
      this.onStarPowerupCollision,
      null,
      this
    );
  }

  onShipCollision(ship, meteor) {
    meteor.disableBody(false, false);
    this.livesDecrease();

    meteor.setVelocityX(0);
    this.anims.create({
      key: "explosion_anim",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 25,
      repeat: 0,
    });

    meteor.setTexture("explosion");
    meteor.play("explosion_anim");

    this.time.addEvent({
      delay: 350,
      callback: () => {
        meteor.destroy();
      },
      loop: false,
    });
  }

  onMissileMeteorCollision(missile, meteor) {
    missile.destroy();
    meteor.setVelocityX(0);
    this.scoreIncrease(10);

    this.anims.create({
      key: "explosion_anim",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 25,
      repeat: 0,
    });

    meteor.setTexture("explosion");
    meteor.play("explosion_anim");

    this.time.addEvent({
      delay: 350,
      callback: () => {
        meteor.destroy();
      },
      loop: false,
    });
  }

  onEnemyCollision(ship, enemy) {
    enemy.disableBody(false, false);
    this.livesDecrease();

    enemy.setVelocityX(0);
    this.anims.create({
      key: "explosion_anim",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 25,
      repeat: 0,
    });

    enemy.setTexture("explosion");
    enemy.play("explosion_anim");

    this.time.addEvent({
      delay: 350,
      callback: () => {
        enemy.destroy();
      },
      loop: false,
    });
  }

  // onEnemySelfCollision(enemy1, enemy2) {
  //   enemy1.setVelocityY(-100);
  //   enemy2.setVelocityY(100);

  //   console.log(enemy1 && enemy2);

  //   let callback = () => {
  //     if (enemy1 && enemy2) {
  //       enemy1.setVelocityY(100);
  //       enemy2.setVelocityY(-100);
  //     } else if (!enemy1) {
  //       enemy2.setVelocityY(0);
  //     } else if (!enemy2) {
  //       enemy1.setVelocityY(0);
  //     } else {
  //       this.enemyTimer.destroy();
  //     }
  //     this.enemyTimer.reset({
  //       delay: 2000,
  //       callback,
  //       loop: true,
  //     });
  //   };

  //   this.enemyTimer = this.time.addEvent({
  //     delay: 2000,
  //     callback,
  //     loop: true,
  //   });
  // }

  onMissileEnemyCollision(missile, enemy) {
    missile.destroy();
    enemy.setVelocityX(0);
    this.scoreIncrease(25);

    this.anims.create({
      key: "explosion_anim",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 25,
      repeat: 0,
    });

    enemy.setTexture("explosion");
    enemy.play("explosion_anim");

    this.time.addEvent({
      delay: 350,
      callback: () => {
        enemy.destroy();
      },
      loop: false,
    });
  }

  onHeartPowerupCollision(ship, heart) {
    heart.destroy();
    this.livesIncrease();
    this.scoreIncrease(25);
  }

  onStarPowerupCollision(ship, star) {
    star.destroy();
    ship.disableBody(false, false);
    this.hearts.setVisible(false);
    this.stars.setVisible(false);
    this.scoreIncrease(25);

    this.anims.create({
      key: "shield_anim",
      frames: this.anims.generateFrameNumbers("shield"),
      frameRate: 30,
      repeat: -1,
    });

    ship.setTexture("shield");
    ship.play("shield_anim");

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        ship.anims.stop();
        ship.setTexture("spaceship");
        ship.enableBody(false, ship.x, ship.y, ship, true, true);
        this.hearts.setVisible(true);
        this.stars.setVisible(true);
      },
      loop: false,
    });
  }

  resizeCollider(obj, num) {
    obj.body.setSize(obj.width - num, obj.height - num, true);
  }

  createSpaceship() {
    this.spaceship = this.physics.add
      .sprite(0, 268, "spaceship")
      .setOrigin(0, 0);

    this.resizeCollider(this.spaceship, 25);
  }

  createMissile() {
    const newMissile = this.physics.add
      .sprite(this.spaceship.x + 15, this.spaceship.y - 5, "missile")
      .setOrigin(0, 0, true);

    newMissile.displayHeight = 75;
    newMissile.displayWidth = 75;

    this.missiles.add(newMissile);
    newMissile.setVelocityX(500);

    this.resizeCollider(newMissile, 50);
  }

  createMeteor() {
    const randomY = Phaser.Math.Between(...this.yRange);
    const randomVelocity = Phaser.Math.Between(...this.velocityRange);

    const newMeteor = this.physics.add
      .sprite(1000, randomY, "meteor")
      .setOrigin(0, 0);

    newMeteor.displayHeight = 42;
    newMeteor.displayWidth = 42;

    this.meteors.add(newMeteor);
    newMeteor.setVelocityX(-randomVelocity);

    this.resizeCollider(newMeteor, 5);
  }

  meteorSpawner() {
    const randomDelay = Phaser.Math.Between(...this.delayRange);
    this.meteors = this.physics.add.group();

    let callback = () => {
      this.createMeteor();
      this.meteorTimer.reset({
        delay: Phaser.Math.Between(...this.delayRange),
        callback,
        loop: true,
      });
    };

    this.meteorTimer = this.time.addEvent({
      delay: randomDelay,
      callback,
      loop: true,
    });
  }

  createEnemyCluster() {
    const newEnemyType1a = this.physics.add
      .sprite(750, 100, "enemy1")
      .setOrigin(0, 0);
    const newEnemyType1b = this.physics.add
      .sprite(750, 190, "enemy1")
      .setOrigin(0, 0);
    const newEnemyType1c = this.physics.add
      .sprite(750, 270, "enemy1")
      .setOrigin(0, 0);
    const newEnemyType1d = this.physics.add
      .sprite(750, 350, "enemy1")
      .setOrigin(0, 0);
    const newEnemyType1e = this.physics.add
      .sprite(750, 430, "enemy1")
      .setOrigin(0, 0);

    const newEnemyType2a = this.physics.add
      .sprite(800, 150, "enemy2")
      .setOrigin(0, 0);
    const newEnemyType2b = this.physics.add
      .sprite(800, 230, "enemy2")
      .setOrigin(0, 0);
    const newEnemyType2c = this.physics.add
      .sprite(800, 310, "enemy2")
      .setOrigin(0, 0);
    const newEnemyType2d = this.physics.add
      .sprite(800, 390, "enemy2")
      .setOrigin(0, 0);

    const newEnemyType3a = this.physics.add
      .sprite(850, 75, "enemy3")
      .setOrigin(0, 0);
    const newEnemyType3b = this.physics.add
      .sprite(850, 475, "enemy3")
      .setOrigin(0, 0);

    const newEnemyType4a = this.physics.add
      .sprite(900, 25, "enemy4")
      .setOrigin(0, 0);
    const newEnemyType4b = this.physics.add
      .sprite(900, 525, "enemy4")
      .setOrigin(0, 0);

    this.enemies.add(newEnemyType1a);
    this.enemies.add(newEnemyType1b);
    this.enemies.add(newEnemyType1c);
    this.enemies.add(newEnemyType1d);
    this.enemies.add(newEnemyType1e);
    this.enemies.add(newEnemyType2a);
    this.enemies.add(newEnemyType2b);
    this.enemies.add(newEnemyType2c);
    this.enemies.add(newEnemyType2d);
    this.enemies.add(newEnemyType3a);
    this.enemies.add(newEnemyType3b);
    this.enemies.add(newEnemyType4a);
    this.enemies.add(newEnemyType4b);

    this.enemies.setVelocityX(-75);
    // newEnemyType3a.setVelocityY(100);
    // newEnemyType3b.setVelocityY(-100);

    this.resizeCollider(newEnemyType1a, 40);
    this.resizeCollider(newEnemyType1b, 40);
    this.resizeCollider(newEnemyType1c, 40);
    this.resizeCollider(newEnemyType1d, 40);
    this.resizeCollider(newEnemyType1e, 40);
    this.resizeCollider(newEnemyType2a, 40);
    this.resizeCollider(newEnemyType2b, 40);
    this.resizeCollider(newEnemyType2c, 40);
    this.resizeCollider(newEnemyType2d, 40);
    this.resizeCollider(newEnemyType3a, 35);
    this.resizeCollider(newEnemyType3b, 35);
    this.resizeCollider(newEnemyType4a, 30);
    this.resizeCollider(newEnemyType4b, 30);
  }

  enemyClusterSpawner() {
    const randomDelay = Phaser.Math.Between(5000, 10000);
    this.enemies = this.physics.add.group();

    let callback = () => {
      this.createEnemyCluster();
      this.enemyTimer.reset({
        delay: Phaser.Math.Between(5000, 10000),
        callback,
        loop: true,
      });
    };

    this.enemyTimer = this.time.addEvent({
      delay: randomDelay,
      callback,
      loop: true,
    });

    // this.createEnemyCluster();
  }

  createHeartPowerUp() {
    const randomY = Phaser.Math.Between(...this.yRange);
    const newHeart = this.physics.add
      .sprite(1000, randomY, "heart")
      .setOrigin(0, 0);
    this.hearts.add(newHeart);

    this.anims.create({
      key: "heart_anim",
      frames: this.anims.generateFrameNumbers("heart"),
      frameRate: 25,
      repeat: -1,
    });

    newHeart.setVelocityX(-250);
    newHeart.play("heart_anim");
    this.resizeCollider(newHeart, 10);
  }

  createStarPowerUp() {
    const randomY = Phaser.Math.Between(...this.yRange);
    const newStar = this.physics.add
      .sprite(1000, randomY, "star")
      .setOrigin(0, 0);
    this.stars.add(newStar);

    this.anims.create({
      key: "star_anim",
      frames: this.anims.generateFrameNumbers("star"),
      frameRate: 25,
      repeat: -1,
    });

    newStar.setVelocityX(-250);
    newStar.play("star_anim");
    this.resizeCollider(newStar, 10);
  }

  powerupSpawner() {
    const randomDelay = Phaser.Math.Between(...this.powerupDelay);
    this.hearts = this.physics.add.group();
    this.stars = this.physics.add.group();

    this.powerupTimer = this.time.addEvent({
      delay: randomDelay,
      callback: () => {
        const powerups = [this.createHeartPowerUp, this.createStarPowerUp];
        const randomPowerup = Phaser.Math.Between(0, powerups.length - 1);
        powerups[randomPowerup].apply(this);
      },
      loop: true,
    });
  }

  UI() {
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: "25px",
    });

    this.livesText = this.add.text(850, 20, `Lives: ${this.lives}`, {
      fontSize: "25px",
    });

    this.gameOverText = this.add.text(350, 250, "GAME OVER", {
      fontSize: "50px",
      fill: "black",
    });
    this.gameOverText.setVisible(false);

    this.getReadyText = this.add.text(340, 200, "GET READY!", {
      fontSize: "60px",
      fill: "black",
    });
    this.getReadyText.setVisible(false);

    this.countdownText = this.add.text(500, 300, `${this.countdown}`, {
      fontSize: "75px",
      fill: "black",
    });
    this.countdownText.setVisible(false);
  }

  scoreIncrease(points) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  livesDecrease() {
    this.lives--;
    this.blinker(50, this.spaceship);
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  livesIncrease() {
    this.lives++;
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  blinker(time, obj) {
    obj.setVisible(false);
    setTimeout(() => {
      obj.setVisible(true);
      setTimeout(() => {
        obj.setVisible(false);
        setTimeout(() => {
          obj.setVisible(true);
        }, time);
      }, time);
    }, time);
  }

  handleInputs() {
    //ARROW KEY FUNTIONALITY
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    const rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    const leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    let speed = 5;

    //MOVES SPACESHIP WITH ARROW KEYS
    if (upKey.isDown) this.spaceship.y = this.spaceship.y - speed;
    if (downKey.isDown) this.spaceship.y = this.spaceship.y + speed;
    if (rightKey.isDown) this.spaceship.x = this.spaceship.x + speed;
    if (leftKey.isDown) this.spaceship.x = this.spaceship.x - speed;

    //WRAPS SPACESHIP FROM TOP TO BOTTOM
    if (this.spaceship.y < -35)
      this.spaceship.setPosition(this.spaceship.x, 575);
    if (this.spaceship.y > 575)
      this.spaceship.setPosition(this.spaceship.x, -35);

    //FIRES ONE MISSILE
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) this.createMissile();
  }

  playerStatus() {
    // if (this.score !== 0) {
    //   if (this.score % 100 === 0 || this.score % 25 === 0) {
    //     this.scoreIncrease(10);
    //     this.enemyClusterSpawner();
    //   }
    // }

    if (this.lives === 0) this.gameOver();
  }

  gameOver() {
    this.destroyAll();

    //GAMEOVER UI
    this.scoreText.setVisible(false);
    this.livesText.setVisible(false);
    this.gameOverText.setVisible(true);
    this.blinker(500, this.gameOverText);

    this.physics.pause();

    this.time.addEvent({
      delay: 2500,
      callback: () => {
        this.gameOverText.setVisible(false);
        this.getReadyText.setVisible(true);
        this.countdownFunc();
      },
      loop: false,
    });

    this.time.addEvent({
      delay: 6000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });

    //RESET UI
    this.score = 0;
    this.lives = 3;
    this.countdown = 3;
  }

  destroyAll() {
    this.spaceship.destroy();
    this.meteorTimer.destroy();
    this.meteors.destroy(true);
    this.missiles.destroy(true);
    this.enemyTimer.destroy();
    this.enemies.destroy(true);
    this.hearts.clear(true);
    this.stars.clear(true);

    // this.meteors.clear(true);
    // this.meteors.setVisible(false);
  }

  countdownFunc() {
    this.countdownText.setText(`${this.countdown}`);
    this.countdownText.setVisible(true);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.countdown--;
        this.countdownText.setText(`${this.countdown}`);
      },
      loop: true,
    });
  }
}

export default SpaceScene;
