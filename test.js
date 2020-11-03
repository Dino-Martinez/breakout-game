// /* This class will represent a 2-Dimensional vector used for basic physics calculations */
// class Vector{
//     // Instance properties
//     x_component:number;
//     y_component:number;
//     // Instantiation methods
//     constructor(x:number, y:number) {
//         this.x_component = x;
//         this.y_component = y;
//     }
//     // Access methods
//     get mag():number {
//         return Math.sqrt((this.x_component ^ 2) + (this.y_component ^ 2));
//     }
//     get dir():number {
//         return Math.atan(this.y_component / this.x_component);
//     }
// }
// /* This interface will serve as the base class for all renderable objects */
// interface RenderableObject {
//     position:Vector;
//     draw(ctx:CanvasRenderingContext2D);
// }
// /* This class will represent the ball that appears on the screen */
// class Ball implements RenderableObject{
//     // Instance properties
//     position:Vector;
//     velocity:Vector;
//     radius:number;
//     color:string;
//     // Instantiation methods
//     constructor(x:number, y:number, x_v:number, y_v:number, radius:number, color:string) {
//         this.position = new Vector(x, y);
//         this.velocity = new Vector(x_v, y_v);
//         this.radius = radius;
//         this.color = color;
//     }
//     // Getters
//     get x():number {
//         return this.position.x_component;
//     }
//     get y():number {
//         return this.position.y_component;
//     }
//     get r():number {
//         return this.radius;
//     }
//     get c():string {
//         return this.color;
//     }
//     // State changers
//     updatePosition():Vector {
//         this.position.x_component += this.velocity.x_component;
//         this.position.y_component += this.velocity.y_component;
//         return this.position;
//     }
//     // Display function
//     draw(ctx:CanvasRenderingContext2D) {
//         // Draw border
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.r + 1, 0, Math.PI * 2);
//         ctx.fillStyle = '#000';
//         ctx.fill();
//         ctx.closePath();
//         // Draw ball
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
//         // ctx.fillStyle = colorList[colorIndex % colorList.length];
//         ctx.fillStyle = this.c;
//         ctx.fill();
//         ctx.closePath();
//     }
// }
// /* This class will represent our player's paddle, which they can use to hit the ball */
// class Paddle implements RenderableObject{
//     // Instance properties
//     position:Vector;
//     velocity:Vector;
//     size:Vector;
//     color:string;
//     // Instantiation methods
//     constructor(x_pos, y_pos, x_vel, width, height, color) {
//         this.position = new Vector(x_pos, y_pos);
//         this.velocity = new Vector(x_vel, 0);
//         this.size = new Vector(width, height);
//         this.color = color;
//     }
//     // Getters
//     get x():number {
//         return this.position.x_component;
//     }
//     get y():number {
//         return this.position.y_component;
//     }
//     get l():number {
//         return this.size.x_component;
//     }
//     get h():number {
//         return this.size.y_component;
//     }
//     // Setters
//     updatePosition():Vector {
//         this.position.x_component += this.velocity.x_component;
//         return this.position;
//     }
//     setSize(width, height):Vector {
//         this.size.x_component = width;
//         this.size.y_component = height;
//         return this.size;
//     }
//     // Display function
//     draw(ctx:CanvasRenderingContext2D) {
//         // Draw border
//         ctx.beginPath();
//         ctx.rect(paddle.x - 1, canvas.height - paddle.h - 3, paddle.l + 2, paddle.h + 2);
//         ctx.fillStyle = '#000000';
//         ctx.fill();
//         ctx.closePath();
//         // Draw Paddle
//         ctx.beginPath();
//         ctx.rect(paddle.x, canvas.height - paddle.h - 2, paddle.l, paddle.h);
//         ctx.fillStyle = '#ffffff';
//         ctx.fill();
//         ctx.closePath();
//     }
// }
// class Brick implements RenderableObject{
//     // Instance properties
//     width:number;
//     height:number;
//     position:Vector;
//     health:number;
//     matrixLocation:Array<number>;
//     // Constructor
//     constructor(width:number, height:number, x:number, y:number, startingHealth:number,matrixLocation:Array<number>) {
//         this.width = width;
//         this.height = height;
//         this.position = new Vector(x, y);
//         this.health = startingHealth;
//         this.matrixLocation = matrixLocation;
//     }
//     // Getters
//     get x():number {
//         return this.position.x_component;
//     }
//     get y():number {
//         return this.position.y_component;
//     }
//     get w():number {
//         return this.width;
//     }
//     get h():number {
//         return this.height;
//     }
//     get hp():number {
//         return this.health;
//     }
//     // State changers
//     editHealth(addition:number) {
//         this.health += addition;
//     }
//     // Display function
//     draw(ctx:CanvasRenderingContext2D) {
//         // Draw border
//         ctx.beginPath();
//         ctx.rect(this.x - 1, this.y - 1, brickWidth + 2, brickHeight + 2);
//         ctx.fillStyle = '#000000';
//         ctx.fill();
//         ctx.closePath();
//         // Draw brick
//         const c:number = this.matrixLocation[0];
//         const r:number = this.matrixLocation[1];
//         ctx.beginPath();
//         ctx.rect(this.x, this.y, brickWidth, brickHeight);
//         if (c % 2 === 0) {
//             ctx.fillStyle = `rgb(${r * c + 200}, ${r * 8 + c * 8}, ${c * 10 + c * 10})`;
//         } else {
//             ctx.fillStyle = `rgb(${r * c}, ${r * 15 + c * 15}, ${200})`;
//         }
//         ctx.fill();
//         ctx.closePath();
//     }
// }
// // TODO: consider writing draw functions inside of my classes that take ctx as a var?
// // TODO: WAY better collision detection is possible, and necessary.
// const canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');
// const paddle:Paddle = new Paddle(canvas.width / 2 - 37.5, canvas.height - 15, 0, 75, 10, "#000");
// const ball:Ball = new Ball(canvas.width / 2, canvas.height - paddle.h - 15, 2, -2, 10, "#ffbad2");
// const rowMultiplier:number = 10;
// const brickRowCount:number = 5;
// const brickColumnCount:number = 12;
// const brickWidth:number = 30;
// const brickHeight:number = 20;
// const brickPadding:number = 10;
// const brickOffsetTop:number = 30;
// const brickOffsetLeft:number = 10;
// const colorList = ['#ffbad2', '#dfd', '#ffe393', '#aecaef'];
// const bricks:Array<Array<Brick>> = [];
// for (let c = 0; c < brickColumnCount; c += 1) {
//   bricks[c] = [];
//   for (let r = 0; r < brickRowCount; r += 1) {
//     const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + ((r % 2) * 10);
//     const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop + ((c % 2) * 5);
//     const matrixLocation:Array<number> = [c, r];
//     bricks[c][r] = new Brick(brickWidth, brickHeight, brickX, brickY, 1, matrixLocation);
//   }
// }
// let maxScore:number;
// let gameOver:number;
// let lives:number = 1;
// let score:number = 0;
// function drawBackground() {
//     ctx.beginPath();
//     ctx.drawImage(<CanvasImageSource> document.getElementById('background-img'), 0, 0, 500, 320);
//     ctx.closePath();
// }
// function drawBricks() {
//     maxScore = 0;
//     for (let c = 0; c < brickColumnCount; c += 1) {
//         for (let r = 0; r < brickRowCount; r += 1) {
//             maxScore += (brickRowCount - r) * rowMultiplier;
//             if (bricks[c][r].hp === 1) {
//                 bricks[c][r].draw(ctx);
//             }
//         }
//     }
// }
// function drawInfo() {
//     // Draw remaining lives
//     ctx.font = '16px Arial';
//     ctx.fillStyle = '#000000';
//     ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
//     // Draw current score
//     ctx.font = '16px Arial';
//     ctx.fillStyle = '#000000';
//     ctx.fillText(`Score: ${score}`, 8, 20);
// }
// function checkCollisions() {
//     // Check ball against paddle
//     if (ball.y + ball.r > paddle.y) {
//         if (ball.x > paddle.x && ball.x < paddle.x + paddle.l) {
//             ball.velocity.y_component = -ball.velocity.y_component;
//             ball.position.y_component = paddle.y - ball.r;
//         }
//     } 
//     // Check ball against bricks
//     for (let c = 0; c < brickColumnCount; c += 1) {
//         for (let r = 0; r < brickRowCount; r += 1) {
//             const current = bricks[c][r];
//             const ballBounds = {left: ball.x - ball.r, right: ball.x + ball.r,
//                                 top: ball.y - ball.r, bottom: ball.y + ball.r}; 
//             if (current.hp === 1) {
//                 if (ballBounds.right > current.x && ballBounds.left < current.x + brickWidth && ballBounds.bottom > current.y && ballBounds.top < current.y + brickHeight) {
//                     ball.velocity.y_component = -ball.velocity.y_component;
//                     current.editHealth(-1);
//                     score += (brickRowCount - r) * rowMultiplier;
//                 }
//             }
//         }
//     }
// }
// function checkBoundaries() {
//     // Check ball against boundaries
//     if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width ) {
//         ball.velocity.x_component = -ball.velocity.x_component;
//     }
//     if (ball.y - ball.r < 0) {
//         ball.velocity.y_component = -ball.velocity.y_component;
//     } else if (ball.y + ball.r > canvas.height) {
//         ball.velocity.y_component = -ball.velocity.y_component;
//         lives -= 1;
//     }
//     // Check paddle against boundaries
//     if (paddle.x - paddle.velocity.x_component < 0) {
//         paddle.position.x_component = 0;
//     }
//     if (paddle.x + paddle.l > canvas.width) {
//         paddle.position.x_component = canvas.width - paddle.l;
//     }
// }
// function checkEndGame() {
//     if (lives === 0) {
//         window.alert("You lost");
//         cancelAnimationFrame(gameOver);
//     }
// }
// function drawGame() {
//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     // Draw background
//     drawBackground();
//     // Draw ball
//     ball.draw(ctx);
//     // Draw paddle
//     paddle.draw(ctx);
//     // Draw bricks
//     drawBricks();
//     // Draw user info
//     drawInfo();
// }
// function updateState() {
//     // Check collisions
//     checkCollisions();
//     // Check boundaries
//     checkBoundaries();
//     // Check end game status
//     checkEndGame();
//     // Move ball
//     ball.updatePosition();
//     // Move paddle
//     paddle.updatePosition();
// }
// function run() {
//     // Draw everything
//     drawGame();
//     // Continue loop
//     gameOver = requestAnimationFrame(run);
//     // Update internal state
//     updateState();
// }
// function keyDownHandler(e) {
//     if (e.key === 'Right' || e.key === 'ArrowRight') {
//         paddle.velocity = new Vector(7, 0);
//     } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
//         paddle.velocity = new Vector(-7, 0);
//     }
// }
// function keyUpHandler(e){
//     if (e.key === 'Right' || e.key === 'ArrowRight') {
//         if (paddle.velocity.x_component > 0) {
//             paddle.velocity = new Vector(0, 0);
//         }
//     } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
//         if (paddle.velocity.x_component < 0) {
//             paddle.velocity = new Vector(0, 0);
//         }
//     }
// }
// document.addEventListener('keydown', keyDownHandler, false);
// document.addEventListener('keyup', keyUpHandler, false);
// run();
//# sourceMappingURL=test.js.map