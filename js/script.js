const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const eatSound = new Audio('assets/sounds/eat.ogg');
const gameOverSound = new Audio('assets/sounds/gameover.ogg');

let snake = [{ x: 200, y: 200 }];
let direction = 'right';
let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 100;
let gameInterval;
let isPaused = false;

highScoreElement.textContent = highScore;

// DOM Elements
const playerNameInput = document.getElementById('playerName');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const loginScreen = document.getElementById('loginScreen');
const gameScreen = document.getElementById('gameScreen');

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function drawGrid() {
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function moveSnake() {
    let head = { ...snake[0] };
    switch (direction) {
        case 'right': head.x += 20; break;
        case 'left': head.x -= 20; break;
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        eatSound.play();
        food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    } else {
        snake.pop();
    }
}

function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function updateGame() {
    if (checkCollision()) {
        gameOverSound.play();
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        highScoreElement.textContent = highScore;
        resetGame();
        loginScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        document.getElementById('gameOverMessage').style.display = 'block';
        clearInterval(gameInterval);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
}

function changeDirection(event) {
    const key = event.key;
    if ((key === 'ArrowUp' || key === 'w') && direction !== 'down') direction = 'up';
    if ((key === 'ArrowDown' || key === 's') && direction !== 'up') direction = 'down';
    if ((key === 'ArrowLeft' || key === 'a') && direction !== 'right') direction = 'left';
    if ((key === 'ArrowRight' || key === 'd') && direction !== 'left') direction = 'right';
}

function startGame() {
    if (playerNameInput.value.trim() === "") {
        alert("Please enter your name to start the game.");
        return;
    }

    loginScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    resetGame();
    gameInterval = setInterval(updateGame, gameSpeed);
}

function pauseGame() {
    if (isPaused) {
        gameInterval = setInterval(updateGame, gameSpeed);
        pauseButton.textContent = "Pause";
    } else {
        clearInterval(gameInterval);
        pauseButton.textContent = "Resume";
    }
    isPaused = !isPaused;
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    score = 0;
    gameSpeed = 100;
    isPaused = false;
    scoreElement.textContent = score;
    clearInterval(gameInterval);
}

// Event Listeners
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
restartButton.addEventListener('click', function () {
    resetGame();
    gameInterval = setInterval(updateGame, gameSpeed);
});
