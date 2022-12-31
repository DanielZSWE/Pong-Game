class Ball {
  constructor(x, y, size, speedX, speedY, maxBounceAngle = 60) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.maxAngle = maxBounceAngle;
    this.totalSpeed = Math.sqrt(speedX * speedX + speedY * speedY);
  }

  draw() {
    fill(255);
    ellipse(this.x, this.y, this.size, this.size);
  }

  update() {
    for (var paddle of paddles) {
      if (this.x >= paddle.x && this.x <= paddle.x + paddle.width) {
        if (this.y > paddle.y && this.y < paddle.y + paddle.height) {
          this.collide(paddle);

          break;
        }
      }
    }

    if (this.x >= width) {
      p1Score++;
      this.speedX = this.totalSpeed * -1;

      this.speedY = 0;
      this.x = width / 2;
      this.y = height / 2;
      recentGoalP1 = true;
    } else if (this.x <= 0) {
      p2Score++;
      this.speedX = this.totalSpeed;
      this.speedY = 0;
      this.x = width / 2;
      this.y = height / 2;
      recentGoalP2 = true;
    } else if (
      this.y - this.size / 2 <= 0 ||
      this.y + this.size / 2 >= height
    ) {
      this.speedY *= -1;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }
  collide(paddle) {
    var intersectPoint =
      (paddle.y + paddle.height / 2 - this.y) / (paddle.height / 2);
    var bounceAngle = ((intersectPoint * this.maxAngle) / 180) * Math.PI;

    this.speedY = this.totalSpeed * -Math.sin(bounceAngle);

    var speedX = this.totalSpeed * Math.cos(bounceAngle);
    this.speedX = this.speedX < 0 ? speedX : -speedX;
    console.log(this.speedX);
  }
}

class Paddle {
  constructor(x, y, width, height, speedY, auto = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedY = speedY;
    this.auto = auto;
  }
  draw() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }
  update() {
    if (this.auto) {
      if (this.y + this.height / 2 < ball.y - this.speedY * 2) {
        if (this.y + this.height < height) {
          this.y += this.speedY;
        }
      } else if (this.y + this.height / 2 > ball.y + this.speedY * 2) {
        if (this.y > 0) {
          this.y -= this.speedY;
        }
      }

      return;
    }

    if (mouseY < width && mouseY > 0) {
      if (this.y + this.height / 2 < mouseY - this.speedY * 2) {
        this.y += this.speedY;
      } else if (this.y + this.height / 2 > mouseY + this.speedY * 2) {
        this.y -= this.speedY;
      }
    }
  }
}

class Button {
  constructor(x, y, width, height, text, func = null) {
    this.x = x - width / 2;
    this.y = y;
    this.width = width;
    this.height = height;
    this.func = func;
    this.text = text;
  }

  checkClicked() {
    if (this.func === null) {
      return;
    }
    if (mouseX >= this.x && mouseX <= this.x + this.width) {
      if (mouseY >= this.y && mouseY <= this.y + this.width) {
        this.func();
      }
    }
  }

  draw() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
    fill(0);
    text(
      this.text,
      this.x + this.width / 2 - (this.text.length / 3.7) * fontSize,
      this.y + this.height / 1.3
    );
  }

  updateText(newVal) {
    this.text = newVal;
  }
}

var ball;
var paddles = [];
var started = false;
var fontSize;
var buttons = [];
var p1Score = 0;
var p2Score = 0;
var p2ScoreTab;
var p1ScoreTab;

var recentGoalP1 = false;
var recentGoalP2 = false;
var soccerball;
function setup() {
  soccerball = loadImage("basketball.png");
  var offsetX = 50;
  fontSize = 30;
  createCanvas(700, 500);
  background(50);

  textSize(fontSize);
  //title
  var title = "Pong Game";
  fill(255);
  text("Pong Game", width / 2 - (fontSize * title.length) / 3.5, height / 12);

  //buttons

  var startButton = new Button(
    width / 2,
    (height * 3.1) / 4,
    width / 5,
    height / 10,
    "Start",
    () => {
      started = true;
    }
  );
  startButton.draw();
  buttons.push(startButton);

  p1ScoreTab = new Button(
    width / 4,
    10,
    width / 10,
    height / 10,
    String(p1Score)
  );

  p2ScoreTab = new Button(
    (width * 3) / 4,
    10,
    width / 10,
    height / 10,
    String(p2Score)
  );

  //rect(width/2 - buttonWidth/2, height * 3/4, buttonWidth, height/10);

  //text(start, width/2 - buttonWidth/2, height * 3/4);

  ball = new Ball(width / 2, height / 2, 20, 7, 0);
  ball.draw();
  var player1 = new Paddle(
    offsetX - 400 / 15,
    height / 4,
    400 / 15,
    height / 3,
    3
  );
  var player2 = new Paddle(
    width - offsetX,
    height / 4,
    400 / 15,
    height / 3,
    2,
    true
  );
  player1.draw();
  player2.draw();
  paddles.push(player2);
  paddles.push(player1);
}

function draw() {
  if (started === true) {
    background(50);

    p1ScoreTab.draw();
    p2ScoreTab.draw();
    if (recentGoalP1) {
      p1ScoreTab.updateText(String(p1Score));
      recentGoalP1 = false;
    } else if (recentGoalP2) {
      p2ScoreTab.updateText(String(p2Score));
      recentGoalP2 = false;
    }

    ball.update();
    ball.draw();

    for (var paddle of paddles) {
      paddle.update();
      paddle.draw();
    }
  }
}

function mousePressed() {
  for (var button of buttons) {
    button.checkClicked();
  }
}
