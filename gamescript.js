const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

//user and computer racket properties
const usr = {
    x: 0,
    y: canvas.height / 2 - 100,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

const cmp = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 100,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//we can take ball color and radius to be user input
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: "White",

    //speed anf velocity along x and y axis
    speed :49,
    velx : 25,
    vely : 25
}

//Function to draw a rectangle
function drawRect(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

drawRect(0, 0, 1100, 500, "Black");

//function to draw a circle
function drawCircle(x,y,r,color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

//function to draw a text block
function  drawTextBlock(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "50px serif";
    ctx.fillText(text, x, y);
}

//for net piece
const netpiece = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "yellow"
}

function createNet() {
    for (let i = 0; i <= canvas.height; i += 14) {
        drawRect(netpiece.x, netpiece.y + i, netpiece.width, netpiece.height, netpiece.color);
    }
}

//create the whole set up
function rendering() {
    //playing table
    drawRect(0, 0, 1100, 500, "Black");
    drawCircle(0, 0, 20, "Green");
    drawCircle(0, canvas.height, 20, "Green");
    drawCircle(canvas.width, 0, 20, "Green");
    drawCircle(canvas.width, canvas.height, 20, "Green");

    //Score board
    drawTextBlock(usr.score, canvas.width / 4, canvas.height / 7, "White");
    drawTextBlock(cmp.score, 3 * canvas.width / 4, canvas.height / 7, "White");

    //Net
    createNet();

    //player bats
    drawRect(usr.x, usr.y, usr.width, usr.height, usr.color);
    drawRect(cmp.x, cmp.y, cmp.width, cmp.height, cmp.color);

    //And Ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//reset ball
function resetBall()
{
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 49;
    ball.velx = -ball.velx;
}
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if( ball.x - ball.radius < 0 ){
        cmp.score++;
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        usr.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velx;
    ball.y += ball.vely;
    
    // computer plays for itself, and we must be able to beat it
    // simple AI
    cmp.y += (ball.y - (cmp.y + cmp.height/2));
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.vely = -ball.vely;
        
    }
    
    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? usr : cmp;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angle = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velx = direction * ball.speed * Math.cos(angle);
        ball.vely = ball.speed * Math.sin(angle);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}


function game() {
    rendering();
    update();
}

//loop
const fps = 50;
setInterval(game, 1000 / fps);


canvas.addEventListener("mousemove", movePaddle);
function movePaddle(evt)
{
    let rect = canvas.getBoundingClientRect();
    usr.y = evt.clientY - rect.top - (usr.height/2);
}