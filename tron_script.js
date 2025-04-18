const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const boom = document.getElementById("boom");
const backgroundMusic = document.getElementById("background-music");

let pos = { x: 100, y: 100 };
let dir = { x: 1, y: 0 }; // start moving right
const speed = 2;
let isGameOver = false;

const visited = new Set();

function updatePosition() {
  if (isGameOver) return;

  pos.x += dir.x * speed;
  pos.y += dir.y * speed;

  const key = `${pos.x}:${pos.y}`;

  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x > window.innerWidth ||
    pos.y > window.innerHeight ||
    visited.has(key)
  ) {
    endGame("Boom! You crashed!");
    return;
  }

  visited.add(key);
  setPosition(player, pos.x, pos.y);
  leaveTrail(pos.x + 3, pos.y + 3); // center trail behind the player
  requestAnimationFrame(updatePosition);
}

function leaveTrail(x, y) {
  const dot = document.createElement("div");
  dot.classList.add("trail");
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  gameArea.appendChild(dot);
}

function setPosition(playerEl, x, y) {
  playerEl.style.left = `${x}px`;
  playerEl.style.top = `${y}px`;
}

function spawnParticles(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 200 + "px";
    const dy = (Math.random() - 0.5) * 200 + "px";

    p.style.setProperty("--dx", dx);
    p.style.setProperty("--dy", dy);

    gameArea.appendChild(p);

    setTimeout(() => p.remove(), 700);
  }
}

function endGame(msg) {
  isGameOver = true;
  const overlay = document.createElement("div");
  overlay.className = "game-over";
  overlay.innerText = msg;
  gameArea.appendChild(overlay);

  spawnParticles(pos.x, pos.y);
  boom.currentTime = 0;
  boom.play();
}

function playBackgroundMusic() {
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
}

document.addEventListener("keydown", (e) => {
  if (isGameOver) return;

  switch (e.key) {
    case "ArrowUp":
      if (dir.y === 0) dir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (dir.y === 0) dir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (dir.x === 0) dir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (dir.x === 0) dir = { x: 1, y: 0 };
      break;
  }
});

playBackgroundMusic();
setPosition(player, pos.x, pos.y);
updatePosition(); // start loop
