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
  },
  preload: function () {
    // assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png')
    this.load.image('background', 'assets/images/medievalVillage/bg_mountains_and_sky.png')
  },
  create: function () {
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background')
    this.background.tileScale.y = 1
    this.background.autoScroll(-40, 0)

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
      let style = {font: '30px Arial', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2, 'Knight Runner', style).anchor.setTo(0.5)

      style = {font: '10px Arial', fill: '#fff'}
      this.add.text(this.game.width / 2, this.game.height / 2 + 50, 'Click to play!', style).anchor.setTo(0.5)

      this.game.input.onDown.addOnce(this.startGame, this)
    }, this)

    startPanelTween.start()
  },

  startGame: function () {
    this.state.start('Preload')
  }

}
