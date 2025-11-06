const cursorLight = document.querySelector('.cursor-light');
const words = Array.from(document.querySelectorAll('.hidden-words span'));
const hero = document.getElementById('hero');
const root = document.documentElement;
const maxDist = 250;

let lastX = 0, lastY = 0, lastTime = Date.now();
const minSize = 300, maxSize = 600;
const speedThreshold = 1000;

words.forEach(word => word.style.opacity = '0');

function flashWord(word, duration = 1800) {
  word.style.opacity = '1';
  clearTimeout(word._timeout);
  word._timeout = setTimeout(() => {
    word.style.opacity = '0';
  }, duration);
}

function isInHero(x, y) {
  const rect = hero.getBoundingClientRect();
  return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
}

function handleMouse(e) {
  const x = e.clientX, y = e.clientY;
  const now = Date.now();
  const dx = x - lastX, dy = y - lastY;
  const dt = now - lastTime;
  const dist = Math.hypot(dx, dy);
  const speed = dist / (dt || 1);

  let newSize = minSize + (Math.min(speed, speedThreshold) / speedThreshold) * (maxSize - minSize);
  root.style.setProperty('--light-size', `${Math.round(newSize)}px`);

  cursorLight.style.transform = `translate(${x}px, ${y}px)`;

  if (isInHero(x, y)) {
    cursorLight.style.display = 'block';
    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      if (Math.hypot(x - wordX, y - wordY) < maxDist) {
        flashWord(word);
      }
    });
  } else {
    cursorLight.style.display = 'none';
  }

  lastX = x; lastY = y; lastTime = now;
}

function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX, y = touch.clientY;

  root.style.setProperty('--light-size', `${maxSize}px`);
  setTimeout(() => root.style.setProperty('--light-size', `${minSize}px`), 200);

  if (isInHero(x, y)) {
    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      if (Math.hypot(x - wordX, y - wordY) < maxDist) {
        flashWord(word);
      }
    });
  }
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    flashWord(word, 2000);
    setTimeout(flicker, 1000 + Math.random() * 800);
  };
  flicker();
}

document.addEventListener('click', () => scrollToSection('about'));
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}
window.addEventListener('DOMContentLoaded', startFlickerLoop);