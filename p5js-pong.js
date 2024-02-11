/**
 * based on p5js-pong by Morritz Ebeling
 * https://gist.github.com/tjjjia/5ad92146b1778ca53a97e8dca8607f64
 * requires p5.js
 * try out at https://editor.p5js.org
 */
let BALL_SPEED = 0.2; // factor/multiplier
let P1_HEIGHT = 60; // height in pixels
let P2_SPEED = 0.8; // px/tick

let ball = {
  x: 300,
  y: 150,
  radius: 3,
  speed: {
    x: 4,
    y: 0
  },
  draw: function() {
    rect(this.x, this.y, this.radius, this.radius);
  },
  reset: function() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed.x = 4;
    this.speed.y = 0;
    this.play = true;
  }
};

let player1 = {
  x: 10,
  y: 150,
  w: 3,
  h: P1_HEIGHT/2, // using radius
  score: 0,
  reset: function() {
    this.y = height / 2;
  },
  position: function(y) {
    this.y = min(height, max(y, 0));
  },
  draw: function() {
    rect(this.x, this.y, this.w, this.h);
  }
}

let player2 = {
  x: 590,
  y: 150,
  w: 3,
  h: 30,
  speed: P2_SPEED, // AI speed
  score: 0,
  reset: function() {
    this.x = width - 10;
    this.y = height / 2;
  },
  position: function(y) {
    this.y = min(height, max(y, 0));
  },
  draw: function() {
    rect(this.x, this.y, this.w, this.h);
  }
}

function setup() {
  createCanvas(600, 480);
  rectMode(RADIUS);
  stroke(255);
  fill(255);

  game.reset();
}

let game = {
  over: false,
  reset: function() {
    this.over = false;
    ball.reset();
    player1.reset();
    player2.reset();
  },
  score: function() {
    console.log(`${player1.score} – ${player2.score}`);
  },
  tick: function() {
    if( this.over === false ){
      // y: keep ball inside of vertical bounds
      if (ball.y < 10 || ball.y > height - 10) {
        ball.speed.y *= -1;
      }

      // x: player 2
      if (ball.x + ball.radius >= player2.x) {
        if (ball.y > player2.y - player2.h &&
            ball.y < player2.y + player2.h) {
          // player 2 hits the ball
          // bounce back
          ball.speed.x *= -1;

        } else {
          // player2 misses the ball
          player1.score += 1;
          this.score();
          this.over = true;
        }
      }

      // y: player 2 "AI" move towards ball
      if (ball.y > player2.y) {
        player2.y += player2.speed;
      } else {
        player2.y -= player2.speed;
      }

      // x: player 1
      if (ball.x - ball.radius <= player1.x) {
        if (ball.y > player1.y - player1.h &&
            ball.y < player1.y + player1.h) {
          // player 1 hits the ball

          // bounce back
          ball.speed.x *= -1;
          // get ball-paddle angle
          let angle = ball.y - player1.y;
          ball.speed.y = angle / 9;
          ball.speed.x = map(abs(angle), 0, player1.h, 3, 9);

        } else {
          // player1 misses the ball
          player2.score += 1;
          this.score();
          this.over = true;
        }
      }
    }

    if (ball.x < -200 || 
      ball.x > width + 200) {
      // reset after ball exceeds boundaries
      game.reset();
    }
    ball.x += ball.speed.x * BALL_SPEED;
    ball.y += ball.speed.y * BALL_SPEED;

    ball.draw();
  }

};

function draw() {
  if (game.over !== true){
    background(0);
  } else if (ball.x <= player1.x) {
    background(255,0,0);
  } else if (ball.x >= player2.x) {
    background(0,255,0);
  }

  player1.position(mouseY);
  player1.draw();

  player2.position(player2.y);
  player2.draw();

  game.tick();
}