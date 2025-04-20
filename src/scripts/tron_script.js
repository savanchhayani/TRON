const game = document.getElementById("game");
const gameOverEl = document.getElementById("gameOver");

const backgroundMusic = document.getElementById("background-music");
const boom = document.getElementById("boom");

const p1 = {
  el: document.getElementById("p1"),
  x: 100,
  y: 100,
  dir: { x: 1, y: 0 },
  keys: {
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright",
  },
  class: "p1",
  name: "Player 1",
  color: "cyan",
};

const p2 = {
  el: document.getElementById("p2"),
  x: 100,
  y: 300,
  dir: { x: 1, y: 0 },
  keys: {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
  },
  class: "p2",
  name: "Player 2",
  color: "rgb(255, 207, 46)",
};

const players = [p1, p2];
const speed = 2;
const trails = new Set();
const bounds = game.getBoundingClientRect();
let gameRunning = true;

function setPosition(player) {
  player.el.style.left = `${player.x}px`;
  player.el.style.top = `${player.y}px`;
}

function movePlayer(player) {
  player.x += player.dir.x * speed;
  player.y += player.dir.y * speed;
}

function getKey(player) {
  return `${player.x}:${player.y}`;
}

function drawTrail(player) {
  const dot = document.createElement("div");
  dot.className = `trail ${player.class}`;
  dot.style.left = `${player.x}px`;
  dot.style.top = `${player.y}px`;
  game.appendChild(dot);
  trails.add(getKey(player));
}

function checkCollision(player) {
  const outOfBounds =
    player.x < 0 ||
    player.x > bounds.width ||
    player.y < 0 ||
    player.y > bounds.height;

  return trails.has(getKey(player)) || outOfBounds;
}

function spawnParticles(player) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = `${player.x}px`;
    p.style.top = `${player.y}px`;
    p.style.backgroundColor = player.color;

    p.style.setProperty("--dx", (Math.random() - 0.5) * 200 + "px");
    p.style.setProperty("--dy", (Math.random() - 0.5) * 200 + "px");

    game.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

function endGame(who) {
  gameRunning = false;
  gameOverEl.style.display = "block";
  gameOverEl.innerText = `${who} crashed`;

  boom.currentTime = 0;
  boom.play();
}

function gameLoop() {
  if (!gameRunning) return;

  for (let player of players) {
    movePlayer(player);

    if (checkCollision(player)) {
      spawnParticles(player);
      endGame(player.name);
      return;
    }

    setPosition(player);
    drawTrail(player);
  }
  requestAnimationFrame(gameLoop);
}

function playBackgroundMusic() {
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
}

function handleKeyPress(e) {
  if (!gameRunning) return;

  const key = e.key.toLowerCase();

  for (let player of players) {
    const { up, down, left, right } = player.keys;
    if (key === up && player.dir.y === 0) {
      player.dir = { x: 0, y: -1 };
    } else if (key === down && player.dir.y === 0) {
      player.dir = { x: 0, y: 1 };
    } else if (key === left && player.dir.x === 0) {
      player.dir = { x: -1, y: 0 };
    } else if (key === right && player.dir.x === 0) {
      player.dir = { x: 1, y: 0 };
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

playBackgroundMusic();
players.forEach(setPosition);
gameLoop(); // start loop
