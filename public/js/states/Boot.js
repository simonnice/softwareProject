var KnightRunner = KnightRunner || {}

// setting game configuration and loading the assets for the loading screen
KnightRunner.BootState = {
  init: function () {
    // loading screen will have a white background

    // have the game centered horizontally
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true

    // physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.style = {font: '30px Press Start 2P', fill: '#fff'}
    this.cursors = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  },
  preload: function () {
    // assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png')
    this.load.image('background', 'assets/images/medievalVillage/bg_mountains_and_sky.png')
    this.load.image('ground', 'assets/images/medievalVillage/terrain_top_center_A_full.png')
    this.load.atlasJSONHash('knight', 'assets/images/valiantKnight/ValiantKnight-all.png', 'assets/images/valiantKnight/ValiantKnight-all.json')
    
  },
  create: function () {
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background')
    this.ground = this.add.tileSprite(0, this.game.world.height - 48, this.game.world.width, 48, 'ground')
    
    this.background.tileScale.y = 1
    this.background.autoScroll(-40, 0)
    this.ground.autoScroll(-60, 0)

    this.knight = this.add.sprite(100, this.game.world.height - 35, 'knight')
    this.knight.anchor.setTo(0.5, 1)
    this.knight.animations.add('running', Phaser.Animation.generateFrameNames('run', 0, 7, '.png', 4), 15, true, false)
    this.knight.animations.play('running')
    

    this.gameStart()
  },
  gameStart: function () {
    // Game Start overlay
    this.startOverlay = this.add.bitmapData(this.game.width, this.game.height)
    this.startOverlay.ctx.fillStyle = '#000'
    this.startOverlay.ctx.fillRect(0, 0, this.game.width, this.game.height)

    // Sprite for the overlay
    this.startPanel = this.add.sprite(0, this.game.height, this.startOverlay)
    this.startPanel.alpha = 0.55

    // overlay raising tween animation
    let startPanelTween = this.add.tween(this.startPanel)
    startPanelTween.to({y: 0}, 100)

    // Stop all movement after overlay reeaches top
    startPanelTween.onComplete.add(function () {
      this.add.text(this.game.width / 2, this.game.height / 2, 'Knight Runner', this.style).anchor.setTo(0.5)
      this.style = {font: '8px Press Start 2P', fill: '#fff'}
      this.add.text(780, this.game.height / 2 + 100, 'Press Up key to jump', this.style).anchor.setTo(0.5)
      this.add.text(800, this.game.height / 2 + 80, 'Press Right key to attack', this.style).anchor.setTo(0.5)

      this.style = {font: '15px Press Start 2P', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2 + 40, 'Press spacebar to play!', this.style).anchor.setTo(0.5)

      this.cursors.onDown.addOnce(this.startGame, this)
    }, this)

    startPanelTween.start()
  },

  startGame: function () {
    this.state.start('Preload')
  }

}
