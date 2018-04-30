var KnightRunner = KnightRunner || {}

KnightRunner.GameState = {

  init: function () {
    // Pool of floors
    this.floorPool = this.add.group()

    // Pool of platforms
    this.platformPool = this.add.group()

    // pool of coins
    this.coinsPool = this.add.group()
    this.coinsPool.enableBody = true

    // pool of enemies
    this.enemyPool = this.add.group()
    this.enemyPool.enableBody = true

    // gravity
    this.game.physics.arcade.gravity.y = 1200

    // max jump distance
    this.maxJumpDistance = 120

    // Move player with keyboard
    this.cursors = this.game.input.keyboard.createCursorKeys()

    // coins
    this.myCoins = 0

    // Speed level
    this.levelSpeed = 250

    this.total = 1
  },
  create: function () {
    // Moving background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background')
    this.background.tileScale.y = 1
    this.background.autoScroll(-this.levelSpeed / 6, 0)
    this.game.world.sendToBack(this.background)

    // Create the player
    this.knight = this.add.sprite(100, 50, 'knight')
    this.knight.anchor.setTo(0.5, 1)

    // Creating hitboxes for the knight animations, attack
    this.hitboxes = this.add.group()
    this.hitboxes.enableBody = true
    this.knight.addChild(this.hitboxes)
    this.hitbox1 = this.hitboxes.create(0, 0, null)
    this.hitbox1.body.setSize(20, 60, 10, -50)
    this.hitbox1.name = 'attack'
    this.hitbox1.body.allowGravity = false

    this.animAttack = this.knight.animations.add('attacking', Phaser.Animation.generateFrameNames('attack', 0, 13, '.png', 4), 60, false, false)

    this.knight.animations.add('running', Phaser.Animation.generateFrameNames('run', 0, 7, '.png', 4), 15, true, false)

    this.knight.animations.add('jumping', Phaser.Animation.generateFrameNames('jump', 0, 3, '.png', 4), 15, false, false)

    this.knight.animations.add('blocking', Phaser.Animation.generateFrameNames('block', 0, 3, '.png', 4), 15, false, false)

    this.game.physics.arcade.enable(this.knight)
    this.game.physics.arcade.enable(this.hitbox1)

    // Change player bounding box
    this.knight.body.setSize(45, 50, -10, 8)
    this.knight.play('running')

    // hard-code first platform
    this.currentPlatform = new KnightRunner.Platform(this.game, this.floorPool, 20, 0, 200, -this.levelSpeed, this.coinsPool, this.enemyPool)
    this.platformPool.add(this.currentPlatform)

    // Coin sound
    this.coinSound = this.add.audio('coinSound')

    this.loadLevel()

    this.disableAllHitboxes()

    // Show number of coins
    let style = {font: '30px Arial', fill: '#fff'}
    this.coinsCountLabel = this.add.text(10, 20, '0', style)

    // Create TImer
    this.timerLabel = this.add.text(10, 60, '0', style)
    this.timer = this.time.create(false)
    this.timer.loop(10000, this.updateCounter, this)
    this.timer.start()

    if (this.total < 20) {
      this.levelSpeed += 5
      this.timerLabel.text = this.total
    }
  },

  update: function () {
    if (this.knight.body.touching.down) {
      this.knight.body.velocity.x = this.levelSpeed
      this.hitbox1.body.velocity.x = this.knight.body.velocity.x - this.levelSpeed
    } else {
      this.knight.body.velocity.x = 0
      this.hitbox1.body.velocity.x = this.knight.body.velocity.x
    }
    if (this.knight.alive) {
    // Iterating through alive platforms to add collision
      this.platformPool.forEachAlive(function (platform, index) {
        this.game.physics.arcade.collide(this.knight, platform, this.onGround, null, this)

        // Check if a platform needs to be killed
        if (platform.length && platform.children[platform.length - 1].right < 0) {
          platform.kill()
        }
      }, this)

      console.log(this.levelSpeed)
      console.log(this.total)

      this.game.physics.arcade.collide(this.hitbox1, this.enemyPool, this.hitEnemy, null, this)
      this.game.physics.arcade.overlap(this.knight, this.coinsPool, this.collectCoin, null, this)
      // this.game.physics.arcade.collide(this.knight, this.enemyPool, this.jumpEnemy, null, this)

      // kill coins that leave the screen
      this.coinsPool.forEachAlive(function (coin) { if (coin.right <= 0) { coin.kill() } }, this)

      // kill enemies that leave the screen
      this.enemyPool.forEachAlive(function (enemy) { if (enemy.right <= 0) { enemy.kill() } }, this)

      if (this.knight.body.touching.down) {
        this.knight.body.velocity.x = this.levelSpeed
        this.hitbox1.body.velocity.x = this.knight.body.velocity.x - this.levelSpeed
      } else {
        this.knight.body.velocity.x = 0
        this.hitbox1.body.velocity.x = this.knight.body.velocity.x
      }

      if (this.cursors.left.isDown) {
        this.knight.play('blocking')
      }

      if (this.cursors.right.downDuration(140)) {
        this.knight.play('attacking')
        this.enableHitBox()
        this.time.events.add(Phaser.Timer.SECOND * 0.3, this.disableAllHitboxes, this)
      }

      if (this.cursors.up.isDown || this.game.input.activePointer.isDown) {
        this.knightJump()
      } else if (this.cursors.up.isUp || this.game.input.activePointer.isUp) {
        this.isJumping = false
      }

      if (this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length - 1].right < this.game.world.width) {
        this.createPlatform()
      }

      // Check if player needs to die
      if (this.knight.top >= this.game.world.height || this.knight.left <= 0) {
        this.gameOver()
      }
    }
  },

  updateCounter: function () {
    this.total++
    this.levelSpeed += 20
  },

  enableHitBox: function () {
    for (let i = 0; i < this.hitboxes.children.length; i++) {
      if (this.hitboxes.children[i].name === 'attack') {
        this.hitboxes.children[i].reset(0, 0)
      }
    }
  },

  increaseLevelSpeed: function () {
    this.levelSpeed += 5
  },

  disableAllHitboxes: function () {
    this.hitboxes.forEachExists(function (hitbox) {
      hitbox.enableBody = false
      hitbox.kill()
    })
  },

  knightJump: function () {
    if (this.knight.body.touching.down) {
      // Starting point of the jump
      this.startJumpY = this.knight.y

      // Keep track of the fact that it is jumping
      this.isJumping = true
      this.jumpPeak = false
      this.knight.animations.play('jumping')
      this.knight.body.velocity.y = -300
    } else if (this.isJumping && !this.jumpPeak) {
      let distanceJumped = this.startJumpY - this.knight.y

      if (distanceJumped <= this.maxJumpDistance) {
        this.knight.animations.play('jumping')
        this.knight.body.velocity.y = -300
      } else {
        this.jumpPeak = true
      }
    }
  },

  onGround () {
    if (this.knight && this.cursors.right.downDuration(140)) {
      this.knight.play('attacking')
      this.enableHitBox()
      this.time.events.add(Phaser.Timer.SECOND * 0.3, this.disableAllHitboxes, this)
    } else if (this.knight && this.cursors.left.isDown) {
      this.knight.play('blocking')
    } else {
      this.knight.play('running')
    }
  },

  // Debugging
  render: function () {
    this.game.debug.body(this.knight)
    this.game.debug.body(this.hitbox1)
  },

  makeArray: function (start, end) {
    let myArray = []
    for (let i = start; i < end; i++) {
      myArray.push(i)
    }
    return myArray
  },
  loadLevel: function () {
    this.createPlatform()
  },
  createPlatform: function () {
    let nextPlatformData = this.generateRandomPlatform()

    // Check to see if there is a "dead" platform that can be used
    if (nextPlatformData) {
      this.currentPlatform = this.platformPool.getFirstDead()
      // if Not
      if (!this.currentPlatform) {
        this.currentPlatform = new KnightRunner.Platform(this.game, this.floorPool, nextPlatformData.numTiles,
          this.game.world.width + nextPlatformData.separation,
          nextPlatformData.y, -this.levelSpeed, this.coinsPool, this.enemyPool)
        // If
      } else {
        this.currentPlatform.prepare(nextPlatformData.numTiles,
          this.game.world.width + nextPlatformData.separation,
          nextPlatformData.y, -this.levelSpeed)
      }

      this.platformPool.add(this.currentPlatform)
    }
  },
  generateRandomPlatform () {
    let data = {}

    // Distance from previous platform
    let minSeparation = 60
    let maxSeparation = 200
    data.separation = minSeparation + Math.random() * (maxSeparation - minSeparation)

    // y in regards to previous platform
    let minDifferenceY = -120
    let maxDifferenceY = 120
    data.y = this.currentPlatform.children[0].y + minDifferenceY + Math.random() * (maxDifferenceY - minDifferenceY)
    data.y = Math.max(150, data.y)
    data.y = Math.min(this.game.world.height - 50, data.y)

    // number of tiles
    let minTiles = 12
    let maxTiles = 20
    data.numTiles = minTiles + Math.random() * (maxTiles - minTiles)

    return data
  },
  collectCoin: function (knight, coin) {
    coin.kill()
    this.myCoins++
    this.coinSound.play()
    this.coinsCountLabel.text = this.myCoins
  },

  jumpEnemy: function (knight, enemy) {
    if (enemy.body.touching.up) {
      enemy.kill()
      console.log('Killed by jumping on head')
    } else {
      this.gameOver()
    }
  },

  hitEnemy: function (hitbox, enemy) {
    enemy.play('dying')
    enemy.kill()
    console.log('Killed by hitEnemy')
  },

  gameOver: function () {
    this.knight.kill()
    this.updateHighscore()
    console.log(this.knight.frame)

    // Game over overlay
    this.overlay = this.add.bitmapData(this.game.width, this.game.height)
    this.overlay.ctx.fillStyle = '#000'
    this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height)

    // Sprite for the overlay
    this.panel = this.add.sprite(0, this.game.height, this.overlay)
    this.panel.alpha = 0.55

    // overlay raising tween animation
    let gameOverPanel = this.add.tween(this.panel)
    gameOverPanel.to({y: 0}, 500)

    // Stop all movement after overlay reeaches top
    gameOverPanel.onComplete.add(function () {
      this.background.stopScroll()

      let style = {font: '30px Arial', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2, 'GAME OVER', style).anchor.setTo(0.5)

      style = {font: '20px Arial', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2 + 50, 'High score:' + this.highScore, style).anchor.setTo(0.5)

      this.add.text(this.game.width / 2, this.game.height / 2 + 80, 'Your score:' + this.myCoins, style).anchor.setTo(0.5)

      style = {font: '10px Arial', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2 + 120, 'Tap to play again', style).anchor.setTo(0.5)

      this.game.input.onDown.addOnce(this.restart, this)
    }, this)

    gameOverPanel.start()
  },
  restart: function () {
    this.game.state.start('Game')
  },

  updateHighscore: function () {
    this.highScore = +window.localStorage.getItem('highScore')

    // Do we have a new high score
    if (this.highScore < this.myCoins) {
      this.highScore = this.myCoins

      window.localStorage.setItem('highScore', this.highScore)
    }
  }
}
