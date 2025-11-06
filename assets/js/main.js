// ==========================================
// REYESCEND — Smooth Aura Cursor Experience
// ==========================================

// Core Elements
const light = document.getElementById("cursorLight");
const words = document.querySelectorAll(".hidden-words span");
const canvas = document.getElementById("trailCanvas");
const ctx = canvas.getContext("2d");

// Canvas Setup
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ------------------------------------------
// Randomize Word Placement (with Safe Zone)
// ------------------------------------------
const safeZone = { xMin: 0.3, xMax: 0.7, yMin: 0.35, yMax: 0.65 };

words.forEach((w) => {
  let randX, randY;
  do {
    randX = Math.random();
    randY = Math.random();
  } while (
    randX > safeZone.xMin &&
    randX < safeZone.xMax &&
    randY > safeZone.yMin &&
    randY < safeZone.yMax
  );

  w.style.setProperty("--x", randX);
  w.style.setProperty("--y", randY);
});

// ------------------------------------------
// Trail + Cursor Glow Logic
// ------------------------------------------
let targetX = 0,
  targetY = 0,
  lastX = 0,
  lastY = 0;

const fadeAlpha = 0.08; // how long the trail lingers

function animateTrail() {
  // Dim previous frame (fades trail gradually)
  ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create radial gradient for glowing trail
  const grad = ctx.createRadialGradient(lastX, lastY, 0, lastX, lastY, 200);
  grad.addColorStop(0, "rgba(255,255,255,0.10)");
  grad.addColorStop(0.4, "rgba(155,0,255,0.08)");
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 200, 0, Math.PI * 2);
  ctx.fill();

  // Eased motion (soft trailing follow)
  lastX += (targetX - lastX) * 0.12;
  lastY += (targetY - lastY) * 0.12;

  requestAnimationFrame(animateTrail);
}
animateTrail();

// ------------------------------------------
// Cursor Movement + Word Reveal
// ------------------------------------------
function moveLight(x, y) {
  targetX = x;
  targetY = y;
  light.style.left = `${x}px`;
  light.style.top = `${y}px`;

  // Reveal words near the light
  words.forEach((word) => {
    const rect = word.getBoundingClientRect();
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const fade = 1 - Math.min(dist / 300, 1);
    word.style.opacity = fade > 0.05 ? fade : 0;
    word.style.color = `rgba(255,255,255,${fade})`;
  });
}

// ------------------------------------------
// Event Listeners (Mouse + Touch)
// ------------------------------------------
document.addEventListener("mousemove", (e) => moveLight(e.clientX, e.clientY));

document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  moveLight(t.clientX, t.clientY);
});

document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  moveLight(t.clientX, t.clientY);
});

// ------------------------------------------
// Ambient Idle Pulses (for mobile + desktop)
// ------------------------------------------
setInterval(() => {
  const w = words[Math.floor(Math.random() * words.length)];
  w.style.opacity = Math.random() * 0.8;
  setTimeout(() => (w.style.opacity = 0), 1500 + Math.random() * 800);
}, 1000);
