// JavaScript code goes here
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 5;
const brickColumnCount = 13;
const brickWidth = 30;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 25;
let score = 0;
let lives = 1;
let maxScore = 0;
const rowMultiplier = 10;
let gameFinished = false;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function endGame(state) {
  const gameOverContainer = document.getElementById('end-game');
  gameOverContainer.style.display = 'flex';
  if (state === 'won') {
    // win game message
    const endMessage = document.getElementById('game-won');
    endMessage.style.display = 'block';
  } else if (state === 'lost') {
    // lose game message
    const endMessage = document.getElementById('game-lost');
    endMessage.style.display = 'block';
  }
  gameFinished = true;
}

function drawBricks() {
  maxScore = 0;
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      maxScore += (brickRowCount - r) * rowMultiplier;
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + ((r % 2) * 10);
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = `rgb(${r * c + 200}, ${r * 5 + c * 5}, ${c * 10 + 25})`;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffbad2';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.closePath();
}

function drawBackground() {
  ctx.beginPath();
  ctx.drawImage(document.getElementById('background-img'), 0, 0, 500, 320);
  ctx.closePath();
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += (brickRowCount - r) * rowMultiplier;
          if (score === maxScore) {
            endGame('win');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function draw() {
  if (!gameFinished) {
    // drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    x += dx;
    y += dy;
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives -= 1;
        if (!lives) {
          endGame('lost');
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    } else if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }
    requestAnimationFrame(draw);
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
draw();
