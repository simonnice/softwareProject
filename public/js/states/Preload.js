var KnightRunner = KnightRunner || {}

// loading the game assets
KnightRunner.PreloadState = {
  preload: function () {
    // show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar')
    this.preloadBar.anchor.setTo(0.5)
    this.preloadBar.scale.setTo(3)

    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('floor', 'assets/images/medievalVillage/terrain_center_A.png')
    this.load.image('coin', 'assets/images/coin.png')
    this.load.image('barrel', 'assets/images/medievalVillage/barrel_A.png')
    this.load.image('newGround', 'assets/images/medievalVillage/groundKnightRunner.png')
    this.load.image('background', 'assets/images/medievalVillage/bg_mountains_and_sky.png')
    this.load.image('ground', 'assets/images/medievalVillage/terrain_top_center_A_full.png')

    this.load.audio('coinSound', 'assets/audio/coin.mp3', 'assets/audio/coin.ogg')
    this.load.audio('attackSound', 'assets/audio/attack2.mp3', 'assets/audio/attack2.ogg')
    this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3', 'assets/audio/backgroundMusic.ogg');


    this.load.atlasJSONHash('knight', 'assets/images/valiantKnight/ValiantKnight-all.png', 'assets/images/valiantKnight/ValiantKnight-all.json')
    this.load.atlasJSONHash('skeletonWarrior', 'assets/images/skeletonWarrior/Enemy.png', 'assets/images/skeletonWarrior/Enemy.json')
  },
  create: function () {
    this.state.start('Game')
  }
}
