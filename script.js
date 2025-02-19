document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const message = document.getElementById('message');
    const starsContainer = document.getElementById('stars');
    const spaceshipElement = document.getElementById('spaceship');
    const asteroidsContainer = document.getElementById('asteroids');
    const powerUpsContainer = document.getElementById('power-ups');

    let score = 0;
    let lives = 3;
    let gameRunning = false;
    let paused = false;
    let spaceship = { x: canvas.width / 2, y: canvas.height - 50, width: 40, height: 40 };
    let asteroids = [];
    let powerUps = [];
    let starCount = 200;

    function initStars() {
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            starsContainer.appendChild(star);
        }
    }

    function createSpaceship() {
        spaceshipElement.style.width = spaceship.width + 'px';
        spaceshipElement.style.height = spaceship.height + 'px';
        spaceshipElement.style.background = 'red';
        spaceshipElement.style.position = 'absolute';
        spaceshipElement.style.left = spaceship.x + 'px';
        spaceshipElement.style.top = spaceship.y + 'px';
        spaceshipElement.style.borderRadius = '50%';
    }

    function moveSpaceship(e) {
        if (!gameRunning || paused) return;
        const speed = 10;
        switch (e.key) {
            case 'ArrowLeft': spaceship.x = Math.max(0, spaceship.x - speed); break;
            case 'ArrowRight': spaceship.x = Math.min(canvas.width - spaceship.width, spaceship.x + speed); break;
            case 'ArrowUp': spaceship.y = Math.max(0, spaceship.y - speed); break;
            case 'ArrowDown': spaceship.y = Math.min(canvas.height - spaceship.height, spaceship.y + speed); break;
        }
        spaceshipElement.style.left = spaceship.x + 'px';
        spaceshipElement.style.top = spaceship.y + 'px';
    }

    function createAsteroid() {
        const asteroid = {
            x: Math.random() * canvas.width,
            y: -30,
            width: 30,
            height: 30,
            speed: 3
        };
        const asteroidDiv = document.createElement('div');
        asteroidDiv.style.width = asteroid.width + 'px';
        asteroidDiv.style.height = asteroid.height + 'px';
        asteroidDiv.style.background = 'gray';
        asteroidDiv.style.position = 'absolute';
        asteroidDiv.style.left = asteroid.x + 'px';
        asteroidDiv.style.top = asteroid.y + 'px';
        asteroidDiv.style.borderRadius = '50%';
        asteroidsContainer.appendChild(asteroidDiv);
        asteroids.push({ div: asteroidDiv, ...asteroid });
    }

    function createPowerUp() {
        const powerUp = {
            x: Math.random() * canvas.width,
            y: -30,
            width: 20,
            height: 20,
            speed: 2
        };
        const powerUpDiv = document.createElement('div');
        powerUpDiv.style.width = powerUp.width + 'px';
        powerUpDiv.style.height = powerUp.height + 'px';
        powerUpDiv.style.background = 'yellow';
        powerUpDiv.style.position = 'absolute';
        powerUpDiv.style.left = powerUp.x + 'px';
        powerUpDiv.style.top = powerUp.y + 'px';
        powerUpDiv.style.borderRadius = '50%';
        powerUpsContainer.appendChild(powerUpDiv);
        powerUps.push({ div: powerUpDiv, ...powerUp });
    }

    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    function updateGame() {
        if (!gameRunning || paused) return;

        asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed;
            asteroid.div.style.top = asteroid.y + 'px';

            if (asteroid.y > canvas.height) {
                score += 10;
                scoreElement.textContent = score;
                asteroidsContainer.removeChild(asteroid.div);
                asteroids.splice(index, 1);
            }

            if (checkCollision(spaceship, asteroid)) {
                lives--;
                livesElement.textContent = lives;
                asteroidsContainer.removeChild(asteroid.div);
                asteroids.splice(index, 1);
                if (lives <= 0) gameOver();
            }
        });

        powerUps.forEach((powerUp, index) => {
            powerUp.y += powerUp.speed;
            powerUp.div.style.top = powerUp.y + 'px';

            if (powerUp.y > canvas.height) {
                powerUpsContainer.removeChild(powerUp.div);
                powerUps.splice(index, 1);
            }

            if (checkCollision(spaceship, powerUp)) {
                score += 50;
                scoreElement.textContent = score;
                powerUpsContainer.removeChild(powerUp.div);
                powerUps.splice(index, 1);
            }
        });

        if (Math.random() < 0.02) createAsteroid();
        if (Math.random() < 0.01) createPowerUp();

        requestAnimationFrame(updateGame);
    }

    function gameOver() {
        gameRunning = false;
        message.style.display = 'block';
        message.textContent = 'O\'yin Tugadi! Hisobingiz: ' + score;
    }

    function startGame() {
        if (gameRunning) return;

        gameRunning = true;
        paused = false;
        score = 0;
        lives = 3;
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        message.style.display = 'none';

        while (asteroidsContainer.firstChild) {
            asteroidsContainer.removeChild(asteroidsContainer.firstChild);
        }
        while (powerUpsContainer.firstChild) {
            powerUpsContainer.removeChild(powerUpsContainer.firstChild);
        }

        asteroids = [];
        powerUps = [];

        spaceship.x = canvas.width / 2;
        spaceship.y = canvas.height - 50;
        spaceshipElement.style.left = spaceship.x + 'px';
        spaceshipElement.style.top = spaceship.y + 'px';

        updateGame();
    }

    function pauseGame() {
        paused = !paused;
        if (paused) {
            message.style.display = 'block';
            message.textContent = 'O\'yin To\'xtatildi';
        } else {
            message.style.display = 'none';
            if (gameRunning) updateGame();
        }
    }

    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    document.addEventListener('keydown', moveSpaceship);

    initStars();
    createSpaceship();
});