var Asteroids = function(){
  //Helper Method
  function isCollision(x1, y1, r1, x2, y2, r2){
    var dist = Math.sqrt(
      Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
      );
    return dist < (r1 + r2);
  }
  //MovingObject Base class *******
  function MovingObject(centerX, centerY, radius, vel, game){
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.vel = vel;
    this.game = game;
  }

  MovingObject.prototype.update = function() {
    this.centerX += this.vel.x;
    this.centerY += this.vel.y;
    this.wrapAround();

  }

  MovingObject.prototype.wrapAround = function(){
    var xDim = Game.XDIM;
    var yDim = Game.YDIM;
    if (this.centerX < 0) {
      this.centerX = xDim;
    }
    else if (this.centerX > xDim) {
      this.centerX = 0;
    }
    else if (this.centerY > yDim) {
      this.centerY = 0;
    }
    else if (this.centerY < 0) {
      this.centerY = yDim;
    }

  }
  MovingObject.prototype.offScreen = function(xDim, yDim) {
    if (this.centerX < 0 || this.centerX > xDim || this.centerY > yDim || this.centerY < 0) {
      return true;
    }
    return false;
  }

  //Asteroids *****
  function Asteroid(centerX,centerY, radius, vel, game){
    MovingObject.apply(this, [centerX, centerY, radius, vel, game]);
  }

  function F(){
    this.constructor = Asteroid;
  }
  F.prototype = new MovingObject();

  Asteroid.prototype = new F();

  Asteroid.randomAsteroid = function(xDim, yDim, speed, game) {

    return new Asteroid(
    xDim * Math.random(),
    yDim * Math.random(),
    (Asteroid.MAX_RADIUS - Asteroid.MIN_RADIUS) * Math.random()  + Asteroid.MIN_RADIUS,
    {x: Math.random() * (2 * speed) - speed, y: Math.random() * (2 * speed) - speed},
    game
    );
  }

  Asteroid.prototype.draw = function (ctx){
    ctx.fillStyle = "#C0C0C0";
    ctx.beginPath();

    ctx.arc(
      this.centerX,
      this.centerY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  }

  Asteroid.prototype.isHit = function(bullet){
    return isCollision(this.centerX, this.centerY, this.radius, bullet.centerX, bullet.centerY, bullet.radius)
  }


  function Bullet(){

  }

  function Ship(centerX, centerY, game){
    this.frontCoord = [centerX, centerY - Ship.RADIUS - 10];
    this.leftCoord = [centerX - Ship.RADIUS, centerY];
    this.rightCoord = [centerX + Ship.RADIUS, centerY];
    var vel = {x: 0, y: 0};

    MovingObject.apply(this,[centerX, centerY, Ship.RADIUS, vel, game])
  }

  function F(){
    this.constructor = Ship;
  }
  F.prototype = new MovingObject();
  Ship.prototype = new F();



  Ship.prototype.update = function(){
    // better to call superclass method here

    this.centerX += this.vel.x;
    this.centerY += this.vel.y;

    
    // triangular points update
    var centerX = this.centerX
    var centerY = this.centerY
    this.wrapAround();

    this.frontCoord[0] += this.vel.x;
    this.frontCoord[1] += this.vel.y;
    this.leftCoord[0] += this.vel.x;
    this.leftCoord[1] += this.vel.y;
    this.rightCoord[0] += this.vel.x;
    this.rightCoord[1] += this.vel.y;


  }

  Ship.prototype.wrapAround = function(){
    if (this.centerX < 0 ){
      this.centerX += Game.XDIM
      this.frontCoord[0] += Game.XDIM
      this.leftCoord[0] += Game.XDIM
      this.rightCoord[0] += Game.XDIM
    }
    else if (this.centerX > Game.XDIM){
      this.centerX -= Game.XDIM
      this.frontCoord[0] -= Game.XDIM
      this.leftCoord[0] -= Game.XDIM
      this.rightCoord[0] -= Game.XDIM

    }
    else if (this.centerY < 0){
      this.centerY += Game.YDIM
      this.frontCoord[1] += Game.YDIM
      this.leftCoord[1] += Game.YDIM
      this.rightCoord[1] += Game.YDIM
    }
    else if (this.centerY > Game.YDIM){
      this.centerY -= Game.YDIM
      this.frontCoord[1] -= Game.YDIM
      this.leftCoord[1] -= Game.YDIM
      this.rightCoord[1] -= Game.YDIM
    }
  }

  Ship.prototype.draw = function(ctx){
     

      // Draw a path
      var frontX = this.frontCoord[0];
      var frontY = this.frontCoord[1];
      ctx.beginPath();
      ctx.moveTo(frontX, frontY);        // Top Corner
      ctx.lineTo(this.rightCoord[0], this.rightCoord[1]); // Bottom Right
      ctx.lineTo(this.leftCoord[0], this.leftCoord[1]);         // Bottom Left
      ctx.closePath();

      // Fill the path
      ctx.fillStyle = "#ffc821";
      ctx.fill();
  }

  Ship.prototype.isHit = function(asteroid){
    return isCollision(this.centerX, this.centerY, this.radius,
                         asteroid.centerX, asteroid.centerY, asteroid.radius);
  }

  Ship.prototype.power = function(v){
    var initVel = this.vel
    console.log(initVel)
    var centerX = this.centerX
    var centerY = this.centerY
    var xDir = (this.frontCoord[0] - centerX) / 20
    var yDir = (this.frontCoord[1] - centerY) / 20


    // var speed = Math.sqrt(Math.pow(initVel.x, 2) + Math.pow(initVel.y, 2)) + v
    var vx = (v * xDir)
    var vy = (v * yDir)
    this.vel.x += vx;
    this.vel.y += vy;
  }

  Ship.prototype.turnRight = function(){
    this.rotate(0.5);

  }

  Ship.prototype.turnLeft = function(){
    this.rotate(-0.5);
  }

  Ship.prototype.rotate = function( theta){
    var coords = [this.frontCoord, this.leftCoord, this.rightCoord];
      var cx = this.centerX;
      var cy = this.centerY;
      coords = _.map(coords, function(coord){
        var x = coord[0];
        var y = coord[1]; 
        var newX = Math.cos(theta) * (x - cx) - Math.sin(theta) * (y - cy) + cx;
        var newY = Math.sin(theta) * (x - cx) + Math.cos(theta) * (y - cy) + cy;
        coord = [newX, newY];
        return coord;
      })
      this.frontCoord = coords[0]
      this.leftCoord = coords[1]
      this.rightCoord = coords[2]
  }

  Ship.prototype.fireBullet = function(){

     new Bullet(this, this.game);
  }

  function Bullet(ship, game){
    var centerX = ship.centerX
    var centerY = ship.centerY
    var bullet_radius = 2
    var initVel = ship.vel
    console.log(initVel)
    var speed = Math.sqrt(Math.pow(initVel.x, 2) + Math.pow(initVel.y, 2)) + 10
    var xDir = ship.frontCoord[0] - centerX
    var yDir = ship.frontCoord[1] - centerY
    var bulletVel = {x: xDir, y: yDir}
    MovingObject.apply(this, [centerX, centerY, bullet_radius, bulletVel, game])
    game.bullets.push(this);
  }

  function F(){
    this.constructor = Bullet;
  }

  F.prototype = new MovingObject();
  Bullet.prototype = new F();

  Bullet.prototype.wrapAround = function(){
    
    if (this.centerX < 0) {
      this.deleteBullet();
    }
    else if (this.centerX > Game.XDIM){
      this.deleteBullet();
    }
    else if (this.centerY > Game.YDIM){
      this.deleteBullet();
    }
    else if (this.centerY < 0){
      this.deleteBullet();
    }
  }

  Bullet.prototype.deleteBullet = function(){
    var index = this.game.bullets.indexOf(this)
    this.game.bullets.splice(index,index + 1)
  }

  Bullet.prototype.draw = function(ctx){
    ctx.fillStyle = "red";
    ctx.beginPath();

    ctx.arc(
      this.centerX,
      this.centerY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();

  }

  function Game(ctx){
    this.ctx = ctx;
    this.asteroids = [];
    this.bullets = [];
    this.ship = new Ship(Game.XDIM / 2, Game.YDIM / 2, this);
    this.gameTime;
    this.generateAsteroids();

  }

  Game.prototype.generateAsteroids = function (){
    var that = this;
    that.asteroids = _.times(Asteroid.NUM, function(){
      return Asteroid.randomAsteroid(
        Game.XDIM,
        Game.YDIM,
        Asteroid.SPEED,
        that
        )
    });
  }


  Game.prototype.draw = function (){
    var that = this;
    that.ctx.clearRect(0,0,Game.XDIM, Game.YDIM);

    var img = new Image;
    img.src = "deep_space.jpg"
    that.ctx.drawImage(img,0,0);
      
    _.each(that.asteroids, function(asteroid){
      asteroid.draw(that.ctx);
    });

    _.each(that.bullets, function(bullet){
      bullet.draw(that.ctx);
    });
    that.ship.draw(that.ctx);
  }

  Game.prototype.checkCollision = function(){
    var that = this;
    _.each(that.asteroids, function(asteroid){
      if(that.ship.isHit(asteroid)){
        $('#win_message').html("Mission Failed! Press [Esc] to restart.")
        Game.lost = true;
        that.stop();
      }
    })

    Game.prototype.checkWin = function(){
      var hasAsteroid = false;
      var asteroids = this.asteroids
      for(var i =0; i < asteroids.length; i++){
        if (asteroids[i] != undefined)
          hasAsteroid = true;
      }
      if(hasAsteroid == false){
        this.stop()
        $('#win_message').html("Mission Accomplished! Press [Esc] for a new game!")
      }
    }

    _.each(that.asteroids, function(asteroid, ai){
      _.each(that.bullets, function(bullet, bi){
        if (asteroid.isHit(bullet)){
          delete that.bullets[bi]
          delete that.asteroids[ai]
        }
      })
    })

  }

  Game.prototype.stop = function(){
    clearInterval(this.gameTime);
    Game.playing = false;
  }

  Game.prototype.update = function(){
    var that = this;
    _.each(that.asteroids, function(asteroid){
      asteroid.update();
    });

    _.each(that.bullets, function(bullet){
      bullet.update();
    })
    that.ship.update();
    that.checkCollision();
    that.checkWin();
  }
  Game.prototype.keyHandling = function (){
    var that = this;
    var moves = {
      'up': .5,
      'down': -.5,
    }

    _.each(moves,function (v, k){
      key(k, function(){
        that.ship.power(v);
      })
    })

    // key('space', function(){
    //   that.ship.fireBullet();
    // })
    $(window).keyup(function(key){
      if (key.keyCode == 32){
        if(Game.playing == true) that.ship.fireBullet();
      }
    })
  
    key('q', function(){
      if(Game.playing == true) that.ship.turnLeft();
    })

    key('left', function(){
      if(Game.playing == true) that.ship.turnLeft();
    })

    key('e', function(){
      if(Game.playing == true) that.ship.turnRight();
    })
    key('right', function(){
      if(Game.playing == true) that.ship.turnRight();
    })
  }



  Game.XDIM = 700;
  Game.YDIM = 400;
  Asteroid.NUM = 10;
  Asteroid.SPEED = 4;
  Asteroid.MAX_RADIUS = 25;
  Asteroid.MIN_RADIUS = 5;
  Ship.RADIUS = 10;
  Game.FPS = 32;
  Game.playing = false;
  Game.lost = false;

  Game.prototype.start = function (){
    this.playGame()
    this.keyHandling();
    var that = this;
    $(window).keyup(function(key){
      console.log(key)
      if (key.keyCode ==  13){
        if (Game.playing == true){
          that.stop()
        }
        else{
          that.playGame();
        }
      }
    })

  }

  Game.prototype.playGame = function(){
    var that = this;
    Game.playing = true
    this.gameTime = setInterval(function(){
      that.update()
      that.draw()
      },
      1000/ Game.FPS
    );

  }

  return{
    Game : Game
  };

}();
