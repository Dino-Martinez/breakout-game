/* This will serve as our template for all renderable objects */
interface RenderableObject {
    // Every drawn object needs a position
    position:Vector2;
    velocity:Vector2;
    size:Vector2;
    color:string;

    // We need to be able to change the position
    // Always return the new position
    updatePosition(delta:Vector2):Vector2;

    // Allow the use of implicit euler's method
    // to move our object based on its velocity (assume dt = 1)
    move():void;

    // Need to allow for changing colors
    changeColor(new_color:string):void;

    // Check for collision between this object and a specified object
    // Based on both objects positions and sizes
    checkCollision(target:RenderableObject):boolean;

    // Every drawn object needs to have some logic that draws it
    // Dependency injection is the canvas context
    draw(ctx:CanvasRenderingContext2D):void;
}

/* This class will represent a 2-Dimensional vector used for basic physics calculations */
class Vector2 {
    // Instance properties
    x_component:number;
    y_component:number;

    // Instantiation methods
    constructor(x:number, y:number) {
        this.x_component = x;
        this.y_component = y;
    }

    // Accessors
    get x():number {
        return this.x_component;
    }

    get y():number {
        return this.y_component;
    }

    get mag():number {
        return Math.sqrt((this.x_component ^ 2) + (this.y_component ^ 2));
    }

    get dir():number {
        return Math.atan(this.y_component / this.x_component);
    }

    // Modifiers
    update(new_x:number, new_y:number):void {
        this.x_component = new_x;
        this.y_component = new_y;
    }
}

/* This class will represent our base class for everything we draw on the screen */
class Sprite implements RenderableObject {
    // Instance properties
    position:Vector2;
    velocity:Vector2;
    size:Vector2;
    color:string;

    // Instantiation
    constructor(x:number, y:number, width:number, height:number, color:string) {
        this.position = new Vector2(x, y);
        this.size = new Vector2(width, height);
        this.color = color;
    }
    
    // Accessors
    get x():number{
        return this.position.x;
    }

    get y():number {
        return this.position.y;
    }

    get width():number {
        return this.size.x;
    }

    get height():number {
        return this.size.y;
    }

    // Modifiers
    updatePosition(delta:Vector2):Vector2 {
        const new_x = this.x + delta.x;
        const new_y = this.y + delta.y;
        this.position.update(new_x, new_y);
        return this.position;
    }

    changeColor(new_color:string):void {
        this.color = new_color;
    }

    // Check for collisions
    checkCollision(target:Sprite):boolean {
        if (this.position.x + this.size.x > target.position.x && this.position.x - 8 < target.position.x + target.size.x) {
            if (this.position.y + this.size.y > target.position.y && this.position.y - 8 < target.position.y + target.size.y) {
                return true;
            }
        }
        return false;
    }

    // Render
    draw(ctx:CanvasRenderingContext2D):void {
        const canvasWidth = ctx.canvas.clientWidth;
        const canvasHeight = ctx.canvas.clientHeight;

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
    }

    // Updating position for paddle will utilize velocity
    move() {
        this.updatePosition(this.velocity);
    }
}

/* This class will represent the player's paddle, used to hit the ball back up */
class Paddle extends Sprite {
    // Instance properties
    position:Vector2;
    velocity:Vector2;
    size:Vector2;
    color:string;

    //Instantiation 
    constructor(x_pos:number, y_pos:number, width:number, height:number, x_vel:number, y_vel:number, color:string) {
        super(x_pos, y_pos, width, height, color);
        this.velocity = new Vector2(x_vel, y_vel);
    }
}

// Ball
/* This class represents the ball that the player must keep up */
class Ball extends Sprite {
    // Instance properties
    position:Vector2;
    velocity:Vector2;
    size:Vector2;
    color:string;

    //Instantiation 
    constructor(x_pos:number, y_pos:number, radius:number, x_vel:number, y_vel:number, color:string) {
        super(x_pos, y_pos, radius, radius, color);
        this.velocity = new Vector2(x_vel, y_vel);
    }

    // Override draw function for ball to draw an arc instead of a rectangle
    draw(ctx:CanvasRenderingContext2D):void {
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
    }
}

// Brick
class Brick extends Sprite {
    // Instance properties
    position:Vector2;
    velocity:Vector2;
    size:Vector2;
    color:string;
    hp:number;

    //Instantiation 
    constructor(x_pos:number, y_pos:number, width:number, height:number, x_vel:number, y_vel:number, color:string, starting_health:number) {
        super(x_pos, y_pos, width, height, color);
        this.velocity = new Vector2(x_vel, y_vel);
        this.hp = starting_health;
    }

    get health():number {
        return this.hp;
    }

    // Modifiers
    reduceHealth(reduction:number):void {
        this.hp -= reduction;
    }
}

class BrickWall {
    // Instance properties
    bricks:Array<Array<Brick>>;
    rows:number;
    columns:number;

    constructor(rows:number = 4, columns:number = 12, bounds:Array<number>) {
        this.rows = rows;
        this.columns = columns;
        this.bricks = [];
        this.initializeBricks(bounds);
    }

    initializeBricks(brickBounds:Array<number>):void {
        const padding:number = 10;
        const width:number = (brickBounds[2] - brickBounds[0]) / this.columns - padding;
        const height:number = (brickBounds[3] - brickBounds[1]) / this.rows - padding;
        for (let c = 0; c < this.columns; c += 1) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rows; r += 1) {
                const x_pos:number = (c * (width + padding)) + brickBounds[0] + ((r % 2) * 10);
                const y_pos:number = (r * (height + padding)) + brickBounds[1] + ((c % 2) * 5);
                this.bricks[c][r] = new Brick(x_pos, y_pos, width, height, 0, 0, 'rgba(0,0,0,0)', 2);
            }
        }
    }

    drawBricks(ctx:CanvasRenderingContext2D):void {
        for (let c = 0; c < this.columns; c += 1) {
            for (let r = 0; r < this.rows; r += 1) {
                if (this.bricks[c][r].health > 0) {
                    const color:string = `rgba(${c * r + 150},${ c * 25},${r * r * 25},${this.bricks[c][r].health/2})`;
                    if (this.bricks[c][r].color != color) {
                        this.bricks[c][r].changeColor(color);
                    }
                    this.bricks[c][r].draw(ctx);
                }
            }
        }
    }

    checkCollision(ball:Ball):void {
        this.bricks.forEach((row) => {
            row.forEach((brick) => {
                if (brick.health > 0) {
                    if (ball.checkCollision(brick)) {
                        ball.velocity.y_component = (ball.velocity.y < 3) ? -1.1 * ball.velocity.y : 3;
                        ball.velocity.x_component = (ball.velocity.x < 3) ? 1.08 * ball.velocity.x : 3;
                        brick.reduceHealth(1);
                    }
                }
            });
        });
    }
}

class BreakoutGame {
    // Instance properties
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    canvasBounds:Array<Sprite>;
    paddle:Paddle;
    ball:Ball;
    brickWall:BrickWall;
    lives:number;

    constructor() {
        this.canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.paddle = new Paddle(this.canvas.width / 2 - 50, this.canvas.height - 12, 100, 10, 0, 0, "#ffffee");
        this.ball = new Ball(this.canvas.width / 2 - 5, this.canvas.height - 25, 10, 2, 2, "#ffbad2");
        const brickBounds:Array<number> = [25,25, this.canvas.width - 25, this.canvas.height / 2 - 25];
        this.brickWall = new BrickWall(4, 12, brickBounds);
        this.canvasBounds = [
            new Sprite(-100, -100, 100, this.canvas.height + 100,'none'),
            new Sprite(-100, -100, this.canvas.width + 100, 100,'none'),
            new Sprite(this.canvas.width, -100, 100, this.canvas.height + 100,'none'),
            new Sprite(-100, this.canvas.height, this.canvas.width + 100, 100, 'none')
        ];
        this.lives = 1;
    }
    
    // Note: lamba syntax is required here to make sure the 'this' context persists through animation frames
    run = ():void => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.brickWall.drawBricks(this.ctx);

        if (this.ball.checkCollision(this.paddle) || this.ball.checkCollision(this.canvasBounds[1]) ) {
            this.ball.velocity.y_component = -this.ball.velocity.y;
        }
        if (this.ball.checkCollision(this.canvasBounds[0]) || this.ball.checkCollision(this.canvasBounds[2])) {
            this.ball.velocity.x_component = -this.ball.velocity.x;
        }
        if (this.ball.checkCollision(this.canvasBounds[3])) {
            this.lives -= 1;
        }
        this.brickWall.checkCollision(this.ball);
        if (this.paddle.checkCollision(this.canvasBounds[0])) {
            this.paddle.velocity.x_component = 0;
            this.paddle.position.x_component = 10;
        }
        if (this.paddle.checkCollision(this.canvasBounds[2])) {
            this.paddle.velocity.x_component = 0;
            this.paddle.position.x_component = this.canvas.width - 105;
        }
        this.ball.move();
        this.paddle.move();
        if (this.lives > 0) {
            requestAnimationFrame(this.run);
        }
    }


    keyDownHandler = (e:KeyboardEvent):void => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            this.paddle.velocity = new Vector2(7, 0);
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            this.paddle.velocity = new Vector2(-7, 0);
        }
    }

    keyUpHandler = (e:KeyboardEvent):void => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            if (this.paddle.velocity.x > 0) {
                this.paddle.velocity = new Vector2(0, 0);
            }
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            if (this.paddle.velocity.x < 0) {
                this.paddle.velocity = new Vector2(0, 0);
            }
        }
    }
}

const game:BreakoutGame = new BreakoutGame();
document.addEventListener('keydown', game.keyDownHandler, false);
document.addEventListener('keyup', game.keyUpHandler, false);
game.run();