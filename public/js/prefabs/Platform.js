var KnightRunner = KnightRunner || {}

KnightRunner.Platform = function (game, floorPool, numTiles, x, y, speed, coinsPool, enemyPool) {
  Phaser.Group.call(this, game)

  this.tileSize = 32
  this.game = game
  this.enableBody = true
  this.floorPool = floorPool
  this.coinsPool = coinsPool
  this.enemyPool = enemyPool
  this.speed = speed

  this.prepare(numTiles, x, y, speed)
}

KnightRunner.Platform.prototype = Object.create(Phaser.Group.prototype)
KnightRunner.Platform.prototype.constructor = KnightRunner.Platform

KnightRunner.Platform.prototype.prepare = function (numTiles, x, y, speed) {
  // Make sure alive
  this.alive = true

  var i = 0
  while (i < numTiles) {
    let floorTile = this.floorPool.getFirstExists(false)

    if (!floorTile) {
      floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'floor')
    } else {
      floorTile.reset(x + i * this.tileSize, y)
    }

    this.add(floorTile)

    i++
  }

  // Set physics properties
  this.setAll('body.immovable', true)
  this.setAll('body.allowGravity', false)
  this.setAll('body.velocity.x', speed)

  this.addCoins(speed)
  this.addEnemy(speed)
}

KnightRunner.Platform.prototype.kill = function () {
  this.alive = false
  this.callAll('kill')

  let sprites = []
  this.forEach(function (tile) {
    sprites.push(tile)
  }, this)

  sprites.forEach(function (tile) {
    this.floorPool.add(tile)
  }, this)
}

KnightRunner.Platform.prototype.addCoins = function (speed) {
  let coinsY = 90 + Math.random() * 110
  let hasCoin
  this.forEach(function (tile) {
    // 40% chance
    hasCoin = Math.random() <= 0.01

    if (hasCoin) {
      let coin = this.coinsPool.getFirstExists(false)

      if (!coin) {
        coin = new Phaser.Sprite(this.game, tile.x, tile.y - coinsY, 'coin')
        this.coinsPool.add(coin)
      } else {
        coin.reset(tile.x, tile.y - coinsY)
      }

      coin.body.velocity.x = speed
      coin.body.allowGravity = false
    }
  }, this)
}

KnightRunner.Platform.prototype.addEnemy = function (speed) {
  let hasEnemy

  this.forEach(function (tile) {
    // 10 % chance
    hasEnemy = Math.random() <= 0.03

    if (hasEnemy) {
      let enemy = this.enemyPool.getFirstExists(false)

      if (!enemy) {
        enemy = new Phaser.Sprite(this.game, tile.x, tile.y - 30, 'skeletonWarrior', 'attack0001.png')
        enemy.anchor.setTo(0.5, 0.5)
        enemy.scale.x *= -1
        enemy.animations.add('attacking', Phaser.Animation.generateFrameNames('attack', 1, 19, '.png', 4), 15, true, false)
        enemy.animations.add('dying', Phaser.Animation.generateFrameNames('die', 1, 20, '.png', 4), 30, false, false)
        enemy.animations.play('attacking')
        this.enemyPool.add(enemy)
      } else {
        enemy.reset(tile.x, tile.y - 30)
        enemy.animations.play('attacking')
      }
      this.game.physics.arcade.enable(enemy)
      enemy.body.velocity.x = speed
      enemy.body.allowGravity = false
    }
  }, this)
}
