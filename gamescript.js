//select canvas
//the canvas will act as the table for the pong game
const canvas = document.getElementById("pong");

//getContext of canvas = methods and properties to draw etc
const ctx = canvas.getContext('2d');

//select the timer element
let tmr = document.getElementById("timer");

// functions for changing the user choice themes
function htheme()
{
    document.body.style.backgroundImage = "url('Images/htheme.png')";
    document.body.style.backgroundSize = "cover";
    canvas.style.borderColor = "#ff8c00";
    net.color = "yellow";

}

function ttheme()
{
    document.body.style.backgroundImage = "url('Images/ttheme.jpg')";
    document.body.style.backgroundSize = "cover";
    canvas.style.borderColor = "##ff1100";
    net.color = "white";
}

function ctheme()
{
    document.body.style.backgroundImage = "url('Images/ctheme.jpg')";
    document.body.style.backgroundSize = "cover";
    canvas.style.borderColor = "#fbff00";
    net.color = "cyan";
}
function stheme()
{
    document.body.style.backgroundImage = "url('Images/stheme.jpg')";
    document.body.style.backgroundSize = "cover";
    canvas.style.borderColor = "#00fffb";
    net.color = "peachpuff";
}

//to show on top of the screen
//time left before the game ends
let timeLeft = {
    minutes : "00",
    seconds : "10"
}

//ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 10,
    color : "RED"
}

//user racket
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

//com (computer's) paddle
const com = {
    x : canvas.width - 10, // for the width of paddle
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

//net to be present in between the table
//acts a demarcation between the user's side and computer's  
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// draw a rectangle, used to draw rackets and the table
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

//moving the user racket with the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

//resetting the ball after each successful score
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 14;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=13){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//text
function drawScore(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px serif";
    ctx.fillText(text, x, y);
}

//collision detection algorithm
//returns true if a collision takes place between a racket and a ball
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

//updates and calculates the movements in each frame
function update(){
    
    // change the score of players
    //if the ball crosses the left border computer wins
    //else if the ball crosses the right border then user wins
    if( ball.x - ball.radius < 0 )
    {
        com.score++;
        resetBall();
    }else if( ball.x + ball.radius > canvas.width)
    {
        user.score++;
        resetBall();
    }
    
    //change the pos of ball according to its velocities
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    //comp's racket movement
    //0.1 is to ensure that human user can win
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    //when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    //we check if the ball hits the user or the com racket
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    //if the ball hits a racket, a collision will be detected
    if(collision(ball,player)){
        
        //we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));

        //normalize the value of collidePoint, we need to get numbers between -1 and 1.
        //-player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        //when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        //when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        //when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        //change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        //speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

//render function for visual aspect of the screen
function render(){
    
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    //draw the user score to the left
    drawScore(user.score,canvas.width/4,canvas.height/5);
    
    //draw the COM score to the right
    drawScore(com.score,3*canvas.width/4,canvas.height/5);
    
    //draw the net
    drawNet();
    
    //draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    //draw the COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    //draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

//set the values to default after a game is finished
function renderDefaults()
{
    user.score = 0;
    com.score = 0;

    user.x = 0;
    user.y = (canvas.height - 100)/2;

    com.x = canvas.width - 10;
    com.y = (canvas.height - 100)/2;

    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 10;
    ball.velocityX = 5;
    ball.velocityY = 5;

    timeLeft.minutes = "00";
    timeLeft.seconds = "15";

    tmr.textContent = "All The Best!";
    tmr.style.color = "Yellow";
    tmr.style.fontWeight = "bolder";
    tmr.style.marginLeft = "580px";
}

//function to be called again and again which calls render and update function
function game(){
    update();
    render();
}

//for the timer at the top of the screen
//it will stop the game as soon as the clock hits 00:00
//and declare the winner through alert message
function reduceTime()
{
    //display the time
    displayTime();

    //the game has ended
    if(timeLeft.minutes=="00" && timeLeft.seconds=="00")
    {
        //user wins
        if(user.score>com.score)
        {
            clearInterval(loop);
            clearInterval(loop2);
            renderDefaults();
            render();
            alert("You Won!")
        }
        //computer wins
        else if(user.score<com.score)
        {
            clearInterval(loop);
            clearInterval(loop2);
            renderDefaults();
            render();
            alert("Sorry, you lost!");
        }
        //it's a tie
        else
        {
            clearInterval(loop);
            clearInterval(loop2);
            renderDefaults();
            render();
            alert("It's a tie!");
        }
    }
    //the game has not ended
    else
    {
        if(timeLeft.seconds=="00")
        {
            //convert string into integer for arithmetic
            let mintemp = parseInt(timeLeft.minutes);
            mintemp--;
            timeLeft.minutes = "0"+mintemp.toString();
            timeLeft.seconds = "60";
        }

        //convert string into integer for arithmetic
        let temp = parseInt(timeLeft.seconds);
        temp--;
        //show red and yellow alternatively when the time left is less than 10 seconds
        if(temp<10)
        {
            if (temp%2==0) {
                tmr.style.color = "red";
            }
            else
            {
                tmr.style.color = "yellow";
            }
            timeLeft.seconds = "0"+temp.toString();
        }
        else
        {
            timeLeft.seconds = temp.toString();
        }
    }
}

//display the time in minutes: seconds format
function displayTime()
{
    tmr.style.marginLeft = "625px";
    tmr.textContent = timeLeft.minutes+":"+timeLeft.seconds;
}

// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop; //for game visual
let loop2; //for timer
let t; //for countdown to game

//start the game
//called when Start Game Button is clicked
function strtgame()
{
    //clearout the loops if start button is presses during an active game
    clearInterval(loop);
    clearTimeout(t);
    clearInterval(loop2);
    renderDefaults();
    render();
    t =  setTimeout(function(){
    tmr.style.color = "red";
    tmr.textContent = "Game Starting In 3...";
    tmr.style.marginLeft = "500px";       
    }, 1000);
    t = setTimeout(function(){
    tmr.style.color = "yellow";
    tmr.textContent = "Game Starting In 2...";        
    }, 2000);
    t = setTimeout(function(){
    tmr.style.color = "#92eb34";
    tmr.textContent = "Game Starting In 1...";        
    }, 3000);
    setTimeout(function(){
    loop = setInterval(game,1000/framePerSecond);
    loop2= setInterval(reduceTime,1000);}, 4000);
}