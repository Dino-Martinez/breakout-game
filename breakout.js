// CONSTANTS
/* const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const rowMultiplier = 10;
const brickRowCount = 5;
const brickColumnCount = 12;
const brickWidth = 30;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 10;
const colorList = ['#ffbad2', '#dfd', '#ffe393', '#aecaef'];
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + ((r % 2) * 10);
    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop + ((c % 2) * 5);
    bricks[c][r] = { x: brickX, y: brickY, status: 1 };
  }
}

// VARIABLES
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let score = 0;
let lives = 1;
let maxScore = 0;
let gameFinished = false;
let colorIndex = 0;

// FUNCTIONS
function endGame(state) {
  gameFinished = true;
  const gameOverContainer = document.getElementById('end-game');
  let endMessage = null;
  gameOverContainer.style.display = 'flex';
  if (state === 'won') {
    endMessage = document.getElementById('game-won');
  } else if (state === 'lost') {
    endMessage = document.getElementById('game-lost');
  }
  endMessage.style.display = 'block';
}

function drawBackground() {
  ctx.beginPath();
  ctx.drawImage(document.getElementById('background-img'), 0, 0, 500, 320);
  ctx.closePath();
}

function drawBricks() {
  maxScore = 0;
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      maxScore += (brickRowCount - r) * rowMultiplier;
      if (bricks[c][r].status === 1) {
        // Draw border
        ctx.beginPath();
        ctx.rect(bricks[c][r].x - 1, bricks[c][r].y - 1, brickWidth + 2, brickHeight + 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();

        // Draw brick
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        if (c % 2 === 0) {
          ctx.fillStyle = `rgb(${r * c + 200}, ${r * 8 + c * 8}, ${c * 10 + c * 10})`;
        } else {
          ctx.fillStyle = `rgb(${r * c}, ${r * 15 + c * 15}, ${200})`;
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  // Draw border
  ctx.arc(x, y, ballRadius + 1, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.closePath();

  // Draw ball
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = colorList[colorIndex % colorList.length];
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  // Draw border
  ctx.beginPath();
  ctx.rect(paddleX - 1, canvas.height - paddleHeight - 3, paddleWidth + 2, paddleHeight + 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.closePath();

  // Draw Paddle
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 2, paddleWidth, paddleHeight);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
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
          colorIndex += 1;
        }
      }
    }
  }
}

function checkBoundaries() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    colorIndex += 1;
  }
  if (y + dy < ballRadius) {
    colorIndex += 1;
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    colorIndex += 1;
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives -= 1;
    }
  }
}

function checkFinished() {
  if (score === maxScore) {
    endGame('won');
  }
  if (lives === 0) {
    endGame('lost');
  }
}

function movePaddle() {
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
}

function moveBall() {
  x += dx;
  y += dy;
}

function updateState() {
  // Update ball location
  moveBall();

  // Update paddle location
  movePaddle();

  // Check boundaries
  checkBoundaries();

  // Check brick collisions
  collisionDetection();

  // Check for end game state
  checkFinished();
}

function draw() {
  if (!gameFinished) {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw everything in priority order
    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    // Continue loop
    requestAnimationFrame(draw);

    // Update internal state
    updateState();
    console.log(gameFinished);
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

// INITIALIZATION CODE

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
draw(); */
