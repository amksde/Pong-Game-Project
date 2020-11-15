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
    speed : 7,
    velx : 5,
    vely : 5
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

    ball.speed = 7;
    ball.velx = -ball.velx;
}
function update() {
    
    //program to control the cmp racket
    if (ball.x-ball.radius<0) {
        cmp.score++;
        resetBall();
    }
    else if (ball.x+ball.radius>canvas.width) {
        usr.score++;
        resetBall();
    }
    
    ball.x += ball.velx;
    ball.y += ball.vely;

    let cmpLevel = 0.1;
    cmp.y += (ball.y-(cmp.y+(cmp.height/2)))*cmpLevel;
    if ((ball.y+ball.radius > canvas.height) || (ball.y-ball.radius <0)) {
        ball.vely = -ball.vely;
    }
    let player;
    if (ball.x+ball.radius<(canvas.width/2)) {
        player = usr;
    }
    else
    {
        player = cmp;
    }
    if (collision(ball, player)) {
        //cldpoint = point of collision
         let cldpoint = (ball.y - (player.y + player.height/2));

         //normalization
         cldpoint = cldpoint/(player.height/2);

         //angle is in radian
         let angle = (Math.PI/4)* cldpoint;
         let direction = (ball.x+ball.radius<(canvas.width/2))?1:-1;

         //change the velocity of the ball
         ball.velx = direction*ball.speed*Math.cos(angle);
         ball.vely = ball.speed*Math.sin(angle);
         ball.speed += 0.5;
    }

}

//game initiation
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.y + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.y + b.radius;

    return (b.right > p.left) && (b.top < p.bottom) && (b.left < p.right) && (b.bottom > p.top);
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