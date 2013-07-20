$(function(){
  console.log(Asteroids);
  $(window).keyup(function(key){
    if(key.keyCode == 27){
      var canvas = $("<canvas width='" + Asteroids.Game.XDIM + "' height= '" +
                  Asteroids.Game.YDIM + "'><canvas>");
      $('#canvas_space').html(canvas);
      var ctx = canvas.get(0).getContext("2d");
      var game = new Asteroids.Game(ctx);
      game.start();
      $('#win_message').html('')
    }
  })
  var canvas = $("<canvas width='" + Asteroids.Game.XDIM + "' height= '" +
              Asteroids.Game.YDIM + "'><canvas>");
  $('#canvas_space').html(canvas);
  var ctx = canvas.get(0).getContext("2d");
  var game = new Asteroids.Game(ctx);

  game.start();
});

