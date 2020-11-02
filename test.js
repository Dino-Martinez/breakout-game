/* This class will represent a 2-Dimensional vector used for basic physics calculations */
var Vector = /** @class */ (function () {
    // Instantiation methods
    function Vector(x, y) {
        this.x_component = x;
        this.y_component = y;
    }
    Object.defineProperty(Vector.prototype, "mag", {
        // Access methods
        get: function () {
            return Math.sqrt((this.x_component ^ 2) + (this.y_component ^ 2));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "dir", {
        get: function () {
            return Math.atan(this.y_component / this.x_component);
        },
        enumerable: false,
        configurable: true
    });
    return Vector;
}());
/* This class will represent the ball that appears on the screen */
var Ball = /** @class */ (function () {
    // Instantiation methods
    function Ball(x, y, x_v, y_v, radius, color) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(x_v, y_v);
        this.radius = radius;
        this.color = color;
    }
    Object.defineProperty(Ball.prototype, "x", {
        // Getters
        get: function () {
            return this.position.x_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "y", {
        get: function () {
            return this.position.y_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "r", {
        get: function () {
            return this.radius;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "c", {
        get: function () {
            return this.color;
        },
        enumerable: false,
        configurable: true
    });
    // State changers
    Ball.prototype.updatePosition = function () {
        this.position.x_component += this.velocity.x_component;
        this.position.y_component += this.velocity.y_component;
        return this.position;
    };
    // Display function
    Ball.prototype.draw = function (ctx) {
        // Draw border
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r + 1, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.closePath();
        // Draw ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        // ctx.fillStyle = colorList[colorIndex % colorList.length];
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.closePath();
    };
    return Ball;
}());
/* This class will represent our player's paddle, which they can use to hit the ball */
var Paddle = /** @class */ (function () {
    // Instantiation methods
    function Paddle(x_pos, y_pos, x_vel, width, height, color) {
        this.position = new Vector(x_pos, y_pos);
        this.velocity = new Vector(x_vel, 0);
        this.size = new Vector(width, height);
        this.color = color;
    }
    Object.defineProperty(Paddle.prototype, "x", {
        // Getters
        get: function () {
            return this.position.x_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paddle.prototype, "y", {
        get: function () {
            return this.position.y_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paddle.prototype, "l", {
        get: function () {
            return this.size.x_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paddle.prototype, "h", {
        get: function () {
            return this.size.y_component;
        },
        enumerable: false,
        configurable: true
    });
    // Setters
    Paddle.prototype.updatePosition = function () {
        this.position.x_component += this.velocity.x_component;
        return this.position;
    };
    Paddle.prototype.setSize = function (width, height) {
        this.size.x_component = width;
        this.size.y_component = height;
        return this.size;
    };
    // Display function
    Paddle.prototype.draw = function (ctx) {
        // Draw border
        ctx.beginPath();
        ctx.rect(paddle.x - 1, canvas.height - paddle.h - 3, paddle.l + 2, paddle.h + 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();
        // Draw Paddle
        ctx.beginPath();
        ctx.rect(paddle.x, canvas.height - paddle.h - 2, paddle.l, paddle.h);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    };
    return Paddle;
}());
var Brick = /** @class */ (function () {
    // Constructor
    function Brick(width, height, x, y, startingHealth, matrixLocation) {
        this.width = width;
        this.height = height;
        this.position = new Vector(x, y);
        this.health = startingHealth;
        this.matrixLocation = matrixLocation;
    }
    Object.defineProperty(Brick.prototype, "x", {
        // Getters
        get: function () {
            return this.position.x_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brick.prototype, "y", {
        get: function () {
            return this.position.y_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brick.prototype, "w", {
        get: function () {
            return this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brick.prototype, "h", {
        get: function () {
            return this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brick.prototype, "hp", {
        get: function () {
            return this.health;
        },
        enumerable: false,
        configurable: true
    });
    // State changers
    Brick.prototype.editHealth = function (addition) {
        this.health += addition;
    };
    // Display function
    Brick.prototype.draw = function (ctx) {
        // Draw border
        ctx.beginPath();
        ctx.rect(this.x - 1, this.y - 1, brickWidth + 2, brickHeight + 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();
        // Draw brick
        var c = this.matrixLocation[0];
        var r = this.matrixLocation[1];
        ctx.beginPath();
        ctx.rect(this.x, this.y, brickWidth, brickHeight);
        if (c % 2 === 0) {
            ctx.fillStyle = "rgb(" + (r * c + 200) + ", " + (r * 8 + c * 8) + ", " + (c * 10 + c * 10) + ")";
        }
        else {
            ctx.fillStyle = "rgb(" + r * c + ", " + (r * 15 + c * 15) + ", " + 200 + ")";
        }
        ctx.fill();
        ctx.closePath();
    };
    return Brick;
}());
// TODO: consider writing draw functions inside of my classes that take ctx as a var?
// TODO: WAY better collision detection is possible, and necessary.
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var paddle = new Paddle(canvas.width / 2 - 37.5, canvas.height - 15, 0, 75, 10, "#000");
var ball = new Ball(canvas.width / 2, canvas.height - paddle.h - 15, 2, -2, 10, "#ffbad2");
var rowMultiplier = 10;
var brickRowCount = 5;
var brickColumnCount = 12;
var brickWidth = 30;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 10;
var colorList = ['#ffbad2', '#dfd', '#ffe393', '#aecaef'];
var bricks = [];
for (var c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r += 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + ((r % 2) * 10);
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop + ((c % 2) * 5);
        var matrixLocation = [c, r];
        bricks[c][r] = new Brick(brickWidth, brickHeight, brickX, brickY, 1, matrixLocation);
    }
}
var maxScore;
var gameOver;
var lives = 1;
var score = 0;
function drawBackground() {
    ctx.beginPath();
    ctx.drawImage(document.getElementById('background-img'), 0, 0, 500, 320);
    ctx.closePath();
}
function drawBricks() {
    maxScore = 0;
    for (var c = 0; c < brickColumnCount; c += 1) {
        for (var r = 0; r < brickRowCount; r += 1) {
            maxScore += (brickRowCount - r) * rowMultiplier;
            if (bricks[c][r].hp === 1) {
                bricks[c][r].draw(ctx);
            }
        }
    }
}
function drawInfo() {
    // Draw remaining lives
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    // Draw current score
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText("Score: " + score, 8, 20);
}
function checkCollisions() {
    // Check ball against paddle
    if (ball.y + ball.r > paddle.y) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.l) {
            ball.velocity.y_component = -ball.velocity.y_component;
            ball.position.y_component = paddle.y - ball.r;
        }
    }
    // Check ball against bricks
    for (var c = 0; c < brickColumnCount; c += 1) {
        for (var r = 0; r < brickRowCount; r += 1) {
            var current = bricks[c][r];
            var ballBounds = { left: ball.x - ball.r, right: ball.x + ball.r,
                top: ball.y - ball.r, bottom: ball.y + ball.r };
            if (current.hp === 1) {
                if (ballBounds.right > current.x && ballBounds.left < current.x + brickWidth && ballBounds.bottom > current.y && ballBounds.top < current.y + brickHeight) {
                    ball.velocity.y_component = -ball.velocity.y_component;
                    current.editHealth(-1);
                    score += (brickRowCount - r) * rowMultiplier;
                }
            }
        }
    }
}
function checkBoundaries() {
    // Check ball against boundaries
    if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) {
        ball.velocity.x_component = -ball.velocity.x_component;
    }
    if (ball.y - ball.r < 0) {
        ball.velocity.y_component = -ball.velocity.y_component;
    }
    else if (ball.y + ball.r > canvas.height) {
        ball.velocity.y_component = -ball.velocity.y_component;
        lives -= 1;
    }
    // Check paddle against boundaries
    if (paddle.x - paddle.velocity.x_component < 0) {
        paddle.position.x_component = 0;
    }
    if (paddle.x + paddle.l > canvas.width) {
        paddle.position.x_component = canvas.width - paddle.l;
    }
}
function checkEndGame() {
    if (lives === 0) {
        window.alert("You lost");
        cancelAnimationFrame(gameOver);
    }
}
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background
    drawBackground();
    // Draw ball
    ball.draw(ctx);
    // Draw paddle
    paddle.draw(ctx);
    // Draw bricks
    drawBricks();
    // Draw user info
    drawInfo();
}
function updateState() {
    // Check collisions
    checkCollisions();
    // Check boundaries
    checkBoundaries();
    // Check end game status
    checkEndGame();
    // Move ball
    ball.updatePosition();
    // Move paddle
    paddle.updatePosition();
}
function run() {
    // Draw everything
    drawGame();
    // Continue loop
    gameOver = requestAnimationFrame(run);
    // Update internal state
    updateState();
}
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.velocity = new Vector(7, 0);
    }
    else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.velocity = new Vector(-7, 0);
    }
}
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (paddle.velocity.x_component > 0) {
            paddle.velocity = new Vector(0, 0);
        }
    }
    else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        if (paddle.velocity.x_component < 0) {
            paddle.velocity = new Vector(0, 0);
        }
    }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
run();
//# sourceMappingURL=test.js.map