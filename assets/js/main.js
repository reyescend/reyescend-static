const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const hero = document.querySelector('#hero');
const maxDist = 280;

let lastX = 0, lastY = 0;
let lightSize = 1;

function handleMouse(e) {
  const x = e.clientX;
  const y = e.clientY;

  // Cursor speed detection
  const dx = x - lastX;
  const dy = y - lastY;
  const speed = Math.sqrt(dx * dx + dy * dy);
  lightSize = Math.min(1.5, 1 + speed / 150);
  lastX = x;
  lastY = y;

  cursorLight.style.transform = `translate(${x}px, ${y}px) scale(${lightSize})`;

  if (!isInHero(x, y)) return;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    const opacity = Math.max(0, 1 - dist / maxDist);
    word.style.opacity = opacity;
  });
}

function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  if (!isInHero(x, y)) return;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    const opacity = Math.max(0, 1 - dist / maxDist);
    if (opacity > 0.3) {
      word.style.opacity = opacity;
      setTimeout(() => (word.style.opacity = 0), 1400);
    }
  });
}

// Limit light to hero section
function isInHero(x, y) {
  const rect = hero.getBoundingClientRect();
  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
}

// Flicker effect
function flickerLoop() {
  words.forEach(word => {
    const flickerTime = 1000 + Math.random() * 4000;
    const visible = Math.random() > 0.7;
    if (!visible) {
      word.style.opacity = 0;
    } else {
      word.style.opacity = 0.2 + Math.random() * 0.3;
    }
  });
  setTimeout(flickerLoop, 3000);
}

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}

flickerLoop();