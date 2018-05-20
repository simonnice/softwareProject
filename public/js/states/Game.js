var KnightRunner = KnightRunner || {}

KnightRunner.GameState = {

  init: function () {
    // Pool of floors
    this.floorPool = this.add.group()

    // Pool of platforms
    this.platformPool = this.add.group()

    // pool of enemies
    this.enemyPool = this.add.group()
    this.enemyPool.enableBody = true

    // gravity
   // this.game.physics.arcade.gravity.y = 1500

    // max jump distance
    this.maxJumpDistance = 120

    // Move player with keyboard
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    // Speed level
    this.levelSpeed = 400

    // Max speed
    this.maxSpeed = 1000

    // Counting time alive

    this.counter = 0

    // Ways to die
    this.skeletonDeath = false
    this.fallDeath = false

    
  },
  create: function () {
    // Moving background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background')
    this.background.tileScale.y = 1
    this.background.autoScroll(-this.levelSpeed / 6, 0)
    this.game.world.sendToBack(this.background)

    // Create the player
    this.knight = this.add.sprite(100, 215, 'knight')
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
    this.knight.body.setSize(45, 50, -5, 10)
    this.knight.play('running')
    this.knight.body.bounce.y = 0.2
    this.knight.body.gravity.y = 2200

    // First enemy free platform
    this.starterPlatform = this.add.tileSprite(5, this.game.world.height - 100, 450, 100, 'newGround' )
    this.game.physics.arcade.enable(this.starterPlatform)
    this.starterPlatform.body.immovable = true
    
    
    // hard-code first platform
    this.currentPlatform = new KnightRunner.Platform(this.game, this.floorPool, 20, 450, this.game.world.height - 100, -this.levelSpeed, this.enemyPool)
    this.platformPool.add(this.currentPlatform)

    // Adding attack
    this.attackSound = this.add.audio('attackSound')
    this.attackSound.volume = 0.3

    // Background Music

    this.music = this.game.add.audio('backgroundMusic')
    this.music.volume = 0.2
    this.music.loop = true // This is what you are lookig for
    this.music.play()
   
   

    this.loadLevel()

    this.disableAllHitboxes()

    // Show number of coins
    let style = {font: '15px Arial', fill: '#fff'}
   

    // Timer for counting High Score
    this.timer = this.game.time.create(false)
    this.timer.loop(250, this.updateCounter, this)
    this.timerLabel = this.add.text(10, 20, '0', style)
    this.timer.start()

    this.barrels = this.game.add.group()
 

    //this.makeBarrels()

    
  },

  update: function () {
    
    
    if (this.knight.alive) {
    // Iterating through alive platforms to add collision
      this.platformPool.forEachAlive(function (platform, index) {
        this.game.physics.arcade.collide(this.knight, platform, this.onGround, null, this)
        this.game.physics.arcade.collide(this.barrels, platform)
        for (let i = 0 ; i < platform.children.length; i++) {
          platform.children[i].body.velocity.x = -this.levelSpeed
        }
        // Check if a platform needs to be killed
        if (platform.length && platform.children[platform.length - 1].right < 0) {
          platform.kill()
        }
      }, this)

      this.starterPlatform.body.velocity.x = -this.levelSpeed
      this.game.physics.arcade.collide(this.knight, this.starterPlatform, this.onGround, null, this)

      if (this.knight.body.touching.down) {
        this.knight.body.velocity.x = this.levelSpeed
        this.hitbox1.body.velocity.x = this.knight.body.velocity.x - this.levelSpeed
      } else {
        this.knight.body.velocity.x = 0
        this.hitbox1.body.velocity.x = this.knight.body.velocity.x
      }

    

      //this.game.physics.arcade.collide(this.knight, this.barrels)velocity.x
      //this.game.physics.arcade.collide(this.barrels)
      this.game.physics.arcade.collide(this.hitbox1, this.enemyPool, this.hitEnemy, null, this)
      this.game.physics.arcade.collide(this.knight, this.enemyPool, this.jumpEnemy, null, this)
      

      // kill enemies that leave the screen
      this.enemyPool.forEachAlive(function (enemy) { if (enemy.right <= 0) { enemy.kill() } }, this)


      if (this.cursors.left.isDown) {
        this.knight.play('blocking')
      }


      if (this.cursors.up.isDown || this.game.input.activePointer.isDown) {
        this.knightJump()
      } else if (this.cursors.up.isUp || this.game.input.activePointer.isUp) {
        this.isJumping = false
        if (this.cursors.right.downDuration(140)) {
          this.knight.play('attacking')
          this.attackSound.play()
          this.enableHitBox()
          this.time.events.add(Phaser.Timer.SECOND * 0.3, this.disableAllHitboxes, this)
        }
      }

      if (this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length - 1].right < this.game.world.width) {
        this.increaseLevelSpeed()
        this.createPlatform()
      }

      // Check if player needs to die
      if (this.knight.top >= this.game.world.height || this.knight.left <= 0) {
        this.fallDeath = true
        this.gameOver()
      }

      /*let fChild = this.barrels.getChildAt(0)
      if (fChild.x < -this.game.width){
        this.makeBarrels()
      }*/
    }
  },

  makeBarrels: function() {
    this.barrels.removeAll()
    let wallHeight = this.game.rnd.integerInRange(1, 2)
    for (let i = 0; i < wallHeight; i++) {
      let barrel = this.game.add.sprite(0, -i * 64, 'barrel')
      this.barrels.add(barrel)
    }
    this.barrels.x = this.game.width
    this.barrels.y = this.game.height - 250
    let that = this.game
    this.barrels.forEach(function(barrel) {
      that.physics.arcade.enable(barrel)
      barrel.body.velocity.x = -this.levelSpeed
      barrel.body.gravity.y = 200
      
      
      
    })
  },

  updateCounter: function () {
    this.counter++
    this.timerLabel.text = this.counter + 'm'
    },
    
  

  enableHitBox: function () {
    for (let i = 0; i < this.hitboxes.children.length; i++) {
      if (this.hitboxes.children[i].name === 'attack') {
        this.hitboxes.children[i].reset(0, 0)
      }
    }
  },

  increaseLevelSpeed: function () {
    this.levelSpeed += 15
    console.log(this.levelSpeed)
    if (this.levelSpeed > 450) {
      this.knight.animations.getAnimation('running').delay = 25
    }
    else if(this.levelSpeed > 500) {
      this.knight.animations.getAnimation('running').delay = 30
    } else if (this.levelSpeed > 700) {
      this.knight.animations.getAnimation('running').delay = 45
    } else if (this.levelSpeed > 1000) {
      this.knight.animations.getAnimation('running').delay = 60
    }
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
    this.enemyPool.forEachAlive(this.renderGroup, this)
    this.game.debug.soundInfo(this.attackSound)
    
  },

  renderGroup: function (member){
    this.game.debug.body(member)
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
          nextPlatformData.y, -this.levelSpeed, this.enemyPool)
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
    let minSeparation = 150
    let maxSeparation = 360
    data.separation = minSeparation + Math.random() * (maxSeparation - minSeparation)
    let rndValue = Math.floor(Math.random() * ( 160 - 30 + 1)) + 30
   
    data.y = this.game.world.height - rndValue

    // number of tiles
    let minTiles = 15
    let maxTiles = 30
    data.numTiles = minTiles + Math.random() * (maxTiles - minTiles)

    return data
  },
 
  jumpEnemy: function (knight, enemy) {
    if (enemy.body.touching.up) {
      enemy.play('dying')
      enemy.events.onAnimationComplete.add(function(){
          enemy.kill()
      }, this)
      console.log('Killed by jumping on head')
    } else {
      this.gameOver()
    }
  },


  hitEnemy: function (hitbox, enemy) {
    enemy.body.setSize(0, 0, 0, 0)
    enemy.play('dying')
    enemy.events.onAnimationComplete.add(function(){
        enemy.kill()
    }, this)
     
    console.log('Killed by hitEnemy')
  },

  gameOver: function () {
    this.knight.kill()
    this.updateHighscore()
    

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
      this.timer.stop()
      this.background.stopScroll()

      let style = {font: '30px Press Start 2P', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2, 'GAME OVER', style).anchor.setTo(0.5)

      if(this.fallDeath === true) {
        style = {font: '20px Press Start 2P', fill: '#fff'}
        this.add.text(this.game.width / 2, this.game.height / 2 + 50, 'You fell to a gruesome death!', style).anchor.setTo(0.5)
      } else {
        style = {font: '20px Press Start 2P', fill: '#fff'}
        this.add.text(this.game.width / 2, this.game.height / 2 + 50, 'Sliced in twain by a skeleton!!', style).anchor.setTo(0.5)
      }

      style = {font: '15px Press Start 2P', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2 + 80, 'High score:' + this.highScore, style).anchor.setTo(0.5)

      this.add.text(this.game.width / 2, this.game.height / 2 + 100, 'Your score:' + this.counter, style).anchor.setTo(0.5)

      style = {font: '10px Press Start 2P', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2 + 140, 'Press space to play again', style).anchor.setTo(0.5)

      this.spaceBar.onDown.addOnce(this.restart, this)
      this.updateHighscore()
      this.submitScore(this.counter)

    }, this)

    gameOverPanel.start()
  },
  restart: function () {
    this.music.stop()
    this.game.state.start('Game')
  },

  updateHighscore: function () {
    this.highScore = +window.localStorage.getItem('highScore')

    // Do we have a new high score
    if (this.highScore < this.counter) {
      this.highScore = this.counter

      window.localStorage.setItem('highScore', this.highScore)

      
    }
  },

  submitScore: function (score, callback) {
    $.post("http://localhost:3000/submitScore", {score:score}, function(data) {
      if(!data) {
        console.log("Server error")
        callback && callback(false)
        return
      }
      
      if(data.error) {
        console.log("Server Error " + data.error)
        callback && callback(false)
        return
      }

      callback && callback(true)
    })
  }
}
