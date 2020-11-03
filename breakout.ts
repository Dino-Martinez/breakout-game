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
    updatePosition(delta:Vector2) {
        const new_x = this.x + delta.x;
        const new_y = this.y + delta.y;
        this.position.update(new_x, new_y);
        return this.position;
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
    draw(ctx:CanvasRenderingContext2D) {
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

    get health() {
        return this.hp;
    }

    // Modifiers
    reduceHealth(reduction:number) {
        this.hp -= reduction;
    }
}

const canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 12, 100, 10, 0, 0, "#ffffee");
const ball = new Ball(canvas.width / 2 - 5, canvas.height - 25, 10, 2, 2, "#ffbad2");
const bricks:Array<Array<Brick>> = [];
const rows:number = 4;
const columns:number = 12;

let lives:number = 1;

// Create invisible boxes on the edges of the screen to check boundaries 
const canvasBounds:Array<Sprite> = [
                                    new Sprite(-100, -100, 100, canvas.height + 100,'none'),
                                    new Sprite(-100, -100, canvas.width + 100, 100,'none'),
                                    new Sprite(canvas.width, -100, 100, canvas.height + 100,'none'),
                                    new Sprite(-100, canvas.height, canvas.width + 100, 100, 'none')
                                ];

function initializeBricks() {
    const brickBounds:Array<number> = [25,25, canvas.width - 25, canvas.height / 2 - 25];
    const padding = 10;
    const width = (brickBounds[2] - brickBounds[0]) / columns - padding;
    const height = (brickBounds[3] - brickBounds[1]) / rows - padding;
    for (let c = 0; c < columns; c += 1) {
        bricks[c] = [];
        for (let r = 0; r < rows; r += 1) {
            const x_pos = (c * (width + padding)) + brickBounds[0] + ((r % 2) * 10);
            const y_pos = (r * (height + padding)) + brickBounds[1] + ((c % 2) * 5);
            bricks[c][r] = new Brick(x_pos, y_pos, width, height, 0, 0, "#ddffdd", 1);
        }
    }
}

function drawBricks() {
    for (let c = 0; c < columns; c += 1) {
        for (let r = 0; r < rows; r += 1) {
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
    if (ball.checkCollision(paddle) || ball.checkCollision(canvasBounds[1]) ) {
        ball.velocity.y_component = -ball.velocity.y;
    }
    if (ball.checkCollision(canvasBounds[0]) || ball.checkCollision(canvasBounds[2])) {
        ball.velocity.x_component = -ball.velocity.x;
    }
    if (ball.checkCollision(canvasBounds[3])) {
        lives -= 1;
    }
    bricks.forEach((row) => {
        row.forEach((brick) => {
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
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.velocity = new Vector2(-7, 0);
    }
}

function keyUpHandler(e){
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (paddle.velocity.x > 0) {
            paddle.velocity = new Vector2(0, 0);
        }
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        if (paddle.velocity.x < 0) {
            paddle.velocity = new Vector2(0, 0);
        }
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

initializeBricks();
run();