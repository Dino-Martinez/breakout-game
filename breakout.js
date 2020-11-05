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
    Sprite.prototype.changeColor = function (new_color) {
        this.color = new_color;
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
var BrickWall = /** @class */ (function () {
    function BrickWall(rows, columns, bounds) {
        if (rows === void 0) { rows = 4; }
        if (columns === void 0) { columns = 12; }
        this.rows = rows;
        this.columns = columns;
        this.bricks = [];
        this.initializeBricks(bounds);
    }
    BrickWall.prototype.initializeBricks = function (brickBounds) {
        var padding = 10;
        var width = (brickBounds[2] - brickBounds[0]) / this.columns - padding;
        var height = (brickBounds[3] - brickBounds[1]) / this.rows - padding;
        for (var c = 0; c < this.columns; c += 1) {
            this.bricks[c] = [];
            for (var r = 0; r < this.rows; r += 1) {
                var x_pos = (c * (width + padding)) + brickBounds[0] + ((r % 2) * 10);
                var y_pos = (r * (height + padding)) + brickBounds[1] + ((c % 2) * 5);
                this.bricks[c][r] = new Brick(x_pos, y_pos, width, height, 0, 0, 'rgba(0,0,0,0)', 2);
            }
        }
    };
    BrickWall.prototype.drawBricks = function (ctx) {
        for (var c = 0; c < this.columns; c += 1) {
            for (var r = 0; r < this.rows; r += 1) {
                if (this.bricks[c][r].health > 0) {
                    var color = "rgba(" + (c * r + 150) + "," + c * 25 + "," + r * r * 25 + "," + this.bricks[c][r].health / 2 + ")";
                    if (this.bricks[c][r].color != color) {
                        this.bricks[c][r].changeColor(color);
                    }
                    this.bricks[c][r].draw(ctx);
                }
            }
        }
    };
    BrickWall.prototype.checkCollision = function (ball) {
        this.bricks.forEach(function (row) {
            row.forEach(function (brick) {
                if (brick.health > 0) {
                    if (ball.checkCollision(brick)) {
                        ball.velocity.y_component = (ball.velocity.y < 3) ? -1.1 * ball.velocity.y : 3;
                        ball.velocity.x_component = (ball.velocity.x < 3) ? 1.08 * ball.velocity.x : 3;
                        brick.reduceHealth(1);
                    }
                }
            });
        });
    };
    return BrickWall;
}());
var BreakoutGame = /** @class */ (function () {
    function BreakoutGame() {
        var _this = this;
        // Note: lamba syntax is required here to make sure the 'this' context persists through animation frames
        this.run = function () {
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.ball.draw(_this.ctx);
            _this.paddle.draw(_this.ctx);
            _this.brickWall.drawBricks(_this.ctx);
            if (_this.ball.checkCollision(_this.paddle) || _this.ball.checkCollision(_this.canvasBounds[1])) {
                _this.ball.velocity.y_component = -_this.ball.velocity.y;
            }
            if (_this.ball.checkCollision(_this.canvasBounds[0]) || _this.ball.checkCollision(_this.canvasBounds[2])) {
                _this.ball.velocity.x_component = -_this.ball.velocity.x;
            }
            if (_this.ball.checkCollision(_this.canvasBounds[3])) {
                _this.lives -= 1;
            }
            _this.brickWall.checkCollision(_this.ball);
            if (_this.paddle.checkCollision(_this.canvasBounds[0])) {
                _this.paddle.velocity.x_component = 0;
                _this.paddle.position.x_component = 10;
            }
            if (_this.paddle.checkCollision(_this.canvasBounds[2])) {
                _this.paddle.velocity.x_component = 0;
                _this.paddle.position.x_component = _this.canvas.width - 105;
            }
            _this.ball.move();
            _this.paddle.move();
            if (_this.lives > 0) {
                requestAnimationFrame(_this.run);
            }
        };
        this.keyDownHandler = function (e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                _this.paddle.velocity = new Vector2(7, 0);
            }
            else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                _this.paddle.velocity = new Vector2(-7, 0);
            }
        };
        this.keyUpHandler = function (e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                if (_this.paddle.velocity.x > 0) {
                    _this.paddle.velocity = new Vector2(0, 0);
                }
            }
            else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                if (_this.paddle.velocity.x < 0) {
                    _this.paddle.velocity = new Vector2(0, 0);
                }
            }
        };
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.paddle = new Paddle(this.canvas.width / 2 - 50, this.canvas.height - 12, 100, 10, 0, 0, "#ffffee");
        this.ball = new Ball(this.canvas.width / 2 - 5, this.canvas.height - 25, 10, 2, 2, "#ffbad2");
        var brickBounds = [25, 25, this.canvas.width - 25, this.canvas.height / 2 - 25];
        this.brickWall = new BrickWall(4, 12, brickBounds);
        this.canvasBounds = [
            new Sprite(-100, -100, 100, this.canvas.height + 100, 'none'),
            new Sprite(-100, -100, this.canvas.width + 100, 100, 'none'),
            new Sprite(this.canvas.width, -100, 100, this.canvas.height + 100, 'none'),
            new Sprite(-100, this.canvas.height, this.canvas.width + 100, 100, 'none')
        ];
        this.lives = 1;
    }
    return BreakoutGame;
}());
var game = new BreakoutGame();
document.addEventListener('keydown', game.keyDownHandler, false);
document.addEventListener('keyup', game.keyUpHandler, false);
game.run();
