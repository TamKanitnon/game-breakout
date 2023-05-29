const canvas = document.getElementById("myCanbas");
const ctx = canvas.getContext("2d");


// // วาดรูปสี่เหลี่ยม rect
// ctx.beginPath();
// ctx.rect(20, 40, 50, 80); // x, y, width, height
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// // วาดรูปวงกลม arc
// ctx.beginPath();
// ctx.arc(240, 160, 30, 0, 2*Math.PI, false); // x, y, r, start, end, optional
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// // วาดรูปสี่เหลี่ยมที่มีแค่เส่นขอบ stroke
// ctx.beginPath();
// ctx.rect(160, 10, 100, 40); // x, y, width, height
// ctx.fillStyle = "yellow";
// ctx.fill();
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();


let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = +0;
let dy = -4;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 200;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;

// Setup the brick variables
const brickRowCount = 4;
const brickColumnCount = 11;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;
const bricks = [];

for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: true };
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score} / ${brickColumnCount*brickRowCount}`, 8, 20);
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if(brick.status) {
                if(brick.x < x && x < (brick.x + brickWidth) && brick.y < y && y < (brick.y + brickHeight)) {
                    dy = -dy;
                    bricks[c][r].status = false;
                    score = score + 1;
                    if(score === brickColumnCount*brickRowCount) {
                        alert("YOU WIN, Congratulations!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status) {
                const brickX = c*(brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r*(brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "brown";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2*Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();

    if(y + dy < ballRadius) { // check top
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) { // check bottom

        if(rightPressed) dx = dx + 1.0;
        if(leftPressed)  dx = dx - 1.0;

        if(paddleX < x && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }

    // check right || check left
    if((x + dx < ballRadius) || (x + dx > canvas.width - ballRadius))  dx = -dx;

    // limit right
    if(rightPressed) paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);

    // limit left
    if(leftPressed) paddleX = Math.max(paddleX - 7, 0);

    x = x + dx;
    y = y + dy;
}

let interval = setInterval(draw, 10);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(event) {
    if(event.key === "ArrowRight") {
        rightPressed = true;
    } else if(event.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if(event.key === "ArrowRight") {
        rightPressed = false;
    } else if(event.key === "ArrowLeft") {
        leftPressed = false;
    }
}