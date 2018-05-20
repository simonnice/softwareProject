var KnightRunner = KnightRunner || {}

KnightRunner.game = new Phaser.Game(960, 320, Phaser.CANVAS, 'gameContainer')

KnightRunner.game.state.add('Boot', KnightRunner.BootState)
KnightRunner.game.state.add('Preload', KnightRunner.PreloadState)
KnightRunner.game.state.add('Game', KnightRunner.GameState)

KnightRunner.game.state.start('Boot')
