/* This class will represent a 2-Dimensional vector used for basic physics calculations */
class Vector{
    // Instance properties
    x_component:number;
    y_component:number;

    // Instantiation methods
    constructor(x:number, y:number) {
        this.x_component = x;
        this.y_component = y;
    }

    // Access methods
    getMagnitude():number {
        return Math.sqrt((this.x_component ^ 2) + (this.y_component ^ 2));
    }

    getDirection():number {
        return Math.atan(this.y_component / this.x_component);
    }
}


/* This class will represent the ball that appears on the screen */
class Ball {
    // Instance properties
    position:Vector;
    velocity:Vector;
    radius:number;
    color:string;

    // Instantiation methods
    constructor(x:number, y:number, x_v:number, y_v:number, radius:number, color:string) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(x_v, y_v);
        this.radius = radius;
        this.color = color;
    }

    // Getters
    getX():number {
        return this.position.x_component;
    }

    getY():number {
        return this.position.y_component;
    }

    getRadius():number {
        return this.radius;
    }

    getColor():string {
        return this.color;
    }

    // State changers
    updatePosition():Vector {
        this.position.x_component += this.velocity.x_component;
        this.position.y_component += this.velocity.y_component;
        return this.position;
    }
}

/* This class will represent our player's paddle, which they can use to hit the ball */
class Paddle {
    // Instance properties
    position:Vector;
    velocity:Vector;
    size:Vector;
    color:string;

    // Instantiation methods
    constructor(x_pos, y_pos, x_vel, width, height, color) {
        this.position = new Vector(x_pos, y_pos);
        this.velocity = new Vector(x_vel, 0);
        this.size = new Vector(width, height);
        this.color = color;
    }

    // Getters
    getX():number {
        return this.position.x_component;
    }

    getY():number {
        return this.position.y_component;
    }

    getWidth():number {
        return this.size.x_component;
    }

    getHeight():number {
        return this.size.y_component;
    }

    // Setters
    updatePosition():Vector {
        this.position.x_component += this.velocity.x_component;
        return this.position;
    }

    setSize(width, height):Vector {
        this.size.x_component = width;
        this.size.y_component = height;
        return this.size;
    }
}

const canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const paddle:Paddle = new Paddle(canvas.width / 2 - 37.5, canvas.height - 15, 0, 75, 10, "#000");
const ball:Ball = new Ball(canvas.width / 2, canvas.height - paddle.getHeight() - 15, 2, -2, 10, "#ffbad2");
const gameOver = false;

let lives = 1;

function drawBackground() {
    ctx.beginPath();
    ctx.drawImage(<CanvasImageSource> document.getElementById('background-img'), 0, 0, 500, 320);
    ctx.closePath();
}

function drawBall() {
    // Draw border
    ctx.beginPath();
    ctx.arc(ball.getX(), ball.getY(), ball.getRadius() + 1, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.getX(), ball.getY(), ball.getRadius(), 0, Math.PI * 2);
    // ctx.fillStyle = colorList[colorIndex % colorList.length];
    ctx.fillStyle = ball.getColor();
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    // Draw border
    ctx.beginPath();
    ctx.rect(paddle.getX() - 1, canvas.height - paddle.getHeight() - 3, paddle.getWidth() + 2, paddle.getHeight() + 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.closePath();

    // Draw Paddle
    ctx.beginPath();
    ctx.rect(paddle.getX(), canvas.height - paddle.getHeight() - 2, paddle.getWidth(), paddle.getHeight());
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background
    drawBackground();

    // Draw ball
    drawBall();

    // Draw paddle
    drawPaddle();

    // Draw bricks
    // drawBricks();
}

function checkCollisions() {
    // Check ball against paddle
    if (ball.getY() + ball.getRadius() > paddle.getY()) {
        if (ball.getX() > paddle.getX() && ball.getX() < paddle.getX() + paddle.getWidth()) {
            ball.velocity.y_component = -ball.velocity.y_component;
        }
    } 
}

function checkBoundaries() {
    // Check ball against boundaries
    if (ball.getX() < 0 || ball.getX() + ball.getRadius() > canvas.width ) {
        ball.velocity.x_component = -ball.velocity.x_component;
    }

    if (ball.getY() < 0) {
        ball.velocity.y_component = -ball.velocity.y_component;
    } else if (ball.getY() + ball.getRadius() > canvas.height) {
        ball.velocity.y_component = -ball.velocity.y_component;
        lives -= 1;
    }

    // Check paddle against boundaries
    if (paddle.getX() < 0) {
        paddle.position.x_component = 0;
    }
    if (paddle.getX() + paddle.getWidth() > canvas.width) {
        paddle.position.x_component = canvas.width - paddle.getWidth();
    }
}

function checkEndGame() {
    if (lives === 0) {
        window.alert("You lost");
    }
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
    requestAnimationFrame(run);

    // Update internal state
    updateState();
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.velocity = new Vector(10, 0);
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.velocity = new Vector(-10, 0);
    }
}

function keyUpHandler(e){
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.velocity = new Vector(0, 0);
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.velocity = new Vector(0, 0);
    }
}

document.addEventListener('keydown', keyDownHandler, false);

document.addEventListener('keyup', keyUpHandler, false);

run();