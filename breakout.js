var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* This class will represent a 2-Dimensional vector used for basic physics calculations */
var Vector2 = /** @class */ (function () {
    // Instantiation methods
    function Vector2(x, y) {
        this.x_component = x;
        this.y_component = y;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        // Accessors
        get: function () {
            return this.x_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this.y_component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "mag", {
        get: function () {
            return Math.sqrt((this.x_component ^ 2) + (this.y_component ^ 2));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "dir", {
        get: function () {
            return Math.atan(this.y_component / this.x_component);
        },
        enumerable: false,
        configurable: true
    });
    // Modifiers
    Vector2.prototype.update = function (new_x, new_y) {
        this.x_component = new_x;
        this.y_component = new_y;
    };
    return Vector2;
}());
/* This class will represent our base class for everything we draw on the screen */
var Sprite = /** @class */ (function () {
    // Instantiation
    function Sprite(x, y, width, height, color) {
        this.position = new Vector2(x, y);
        this.size = new Vector2(width, height);
        this.color = color;
    }
    Object.defineProperty(Sprite.prototype, "x", {
        // Accessors
        get: function () {
            return this.position.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "width", {
        get: function () {
            return this.size.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "height", {
        get: function () {
            return this.size.y;
        },
        enumerable: false,
        configurable: true
    });
    // Modifiers
    Sprite.prototype.updatePosition = function (delta) {
        var new_x = this.x + delta.x;
        var new_y = this.y + delta.y;
        this.position.update(new_x, new_y);
        return this.position;
    };
    // Check for collisions
    Sprite.prototype.checkCollision = function (target) {
        if (this.position.x + this.size.x > target.position.x && this.position.x - 8 < target.position.x + target.size.x) {
            if (this.position.y + this.size.y > target.position.y && this.position.y - 8 < target.position.y + target.size.y) {
                return true;
            }
        }
        return false;
    };
    // Render
    Sprite.prototype.draw = function (ctx) {
        var canvasWidth = ctx.canvas.clientWidth;
        var canvasHeight = ctx.canvas.clientHeight;
        // Draw a rectangle using our instance properties
        // Draw a border
        ctx.beginPath();
        ctx.rect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();
        // Draw object
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
    // Updating position for paddle will utilize velocity
    Sprite.prototype.move = function () {
        this.updatePosition(this.velocity);
    };
    return Sprite;
}());
/* This class will represent the player's paddle, used to hit the ball back up */
var Paddle = /** @class */ (function (_super) {
    __extends(Paddle, _super);
    //Instantiation 
    function Paddle(x_pos, y_pos, width, height, x_vel, y_vel, color) {
        var _this = _super.call(this, x_pos, y_pos, width, height, color) || this;
        _this.velocity = new Vector2(x_vel, y_vel);
        return _this;
    }
    return Paddle;
}(Sprite));
// Ball
/* This class represents the ball that the player must keep up */
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    //Instantiation 
    function Ball(x_pos, y_pos, radius, x_vel, y_vel, color) {
        var _this = _super.call(this, x_pos, y_pos, radius, radius, color) || this;
        _this.velocity = new Vector2(x_vel, y_vel);
        return _this;
    }
    // Override draw function for ball to draw an arc instead of a rectangle
    Ball.prototype.draw = function (ctx) {
        // Draw border
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width + 1, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.closePath();
        // Draw ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        // ctx.fillStyle = colorList[colorIndex % colorList.length];
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
    return Ball;
}(Sprite));
// Brick
var Brick = /** @class */ (function (_super) {
    __extends(Brick, _super);
    //Instantiation 
    function Brick(x_pos, y_pos, width, height, x_vel, y_vel, color, starting_health) {
        var _this = _super.call(this, x_pos, y_pos, width, height, color) || this;
        _this.velocity = new Vector2(x_vel, y_vel);
        _this.hp = starting_health;
        return _this;
    }
    Object.defineProperty(Brick.prototype, "health", {
        get: function () {
            return this.hp;
        },
        enumerable: false,
        configurable: true
    });
    // Modifiers
    Brick.prototype.reduceHealth = function (reduction) {
        this.hp -= reduction;
    };
    return Brick;
}(Sprite));
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 12, 100, 10, 0, 0, "#ffffee");
var ball = new Ball(canvas.width / 2 - 5, canvas.height - 25, 10, 2, 2, "#ffbad2");
var bricks = [];
var rows = 4;
var columns = 12;
var lives = 1;
// Create invisible boxes on the edges of the screen to check boundaries 
var canvasBounds = [
    new Sprite(-100, -100, 100, canvas.height + 100, 'none'),
    new Sprite(-100, -100, canvas.width + 100, 100, 'none'),
    new Sprite(canvas.width, -100, 100, canvas.height + 100, 'none'),
    new Sprite(-100, canvas.height, canvas.width + 100, 100, 'none')
];
function initializeBricks() {
    var brickBounds = [25, 25, canvas.width - 25, canvas.height / 2 - 25];
    var padding = 10;
    var width = (brickBounds[2] - brickBounds[0]) / columns - padding;
    var height = (brickBounds[3] - brickBounds[1]) / rows - padding;
    for (var c = 0; c < columns; c += 1) {
        bricks[c] = [];
        for (var r = 0; r < rows; r += 1) {
            var x_pos = (c * (width + padding)) + brickBounds[0] + ((r % 2) * 10);
            var y_pos = (r * (height + padding)) + brickBounds[1] + ((c % 2) * 5);
            bricks[c][r] = new Brick(x_pos, y_pos, width, height, 0, 0, "#ddffdd", 1);
        }
    }
}
function drawBricks() {
    for (var c = 0; c < columns; c += 1) {
        for (var r = 0; r < rows; r += 1) {
            if (bricks[c][r].health > 0) {
                bricks[c][r].draw(ctx);
            }
        }
    }
}
function run() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw(ctx);
    paddle.draw(ctx);
    drawBricks();
    if (ball.checkCollision(paddle) || ball.checkCollision(canvasBounds[1])) {
        ball.velocity.y_component = -ball.velocity.y;
    }
    if (ball.checkCollision(canvasBounds[0]) || ball.checkCollision(canvasBounds[2])) {
        ball.velocity.x_component = -ball.velocity.x;
    }
    if (ball.checkCollision(canvasBounds[3])) {
        lives -= 1;
    }
    bricks.forEach(function (row) {
        row.forEach(function (brick) {
            if (brick.health > 0) {
                if (ball.checkCollision(brick)) {
                    ball.velocity.y_component = -ball.velocity.y;
                    brick.reduceHealth(1);
                }
            }
        });
    });
    if (paddle.checkCollision(canvasBounds[0])) {
        paddle.velocity.x_component = 0;
        paddle.position.x_component = 10;
    }
    if (paddle.checkCollision(canvasBounds[2])) {
        paddle.velocity.x_component = 0;
        paddle.position.x_component = canvas.width - 105;
    }
    ball.move();
    paddle.move();
    console.log(paddle.velocity.x);
    if (lives > 0) {
        requestAnimationFrame(run);
    }
}
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.velocity = new Vector2(7, 0);
    }
    else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.velocity = new Vector2(-7, 0);
    }
}
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (paddle.velocity.x > 0) {
            paddle.velocity = new Vector2(0, 0);
        }
    }
    else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        if (paddle.velocity.x < 0) {
            paddle.velocity = new Vector2(0, 0);
        }
    }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
initializeBricks();
run();
//# sourceMappingURL=breakout.js.map