const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
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

function handleMouse(e) {
  const x = e.clientX;
  const y = e.clientY;
  const now = Date.now();
  const dx = x - lastX;
  const dy = y - lastY;
  const dt = now - lastTime;
  const dist = Math.hypot(dx, dy);
  const speed = dist / (dt || 1);

  let newSize = minSize + (Math.min(speed, speedThreshold) / speedThreshold) * (maxSize - minSize);
  newSize = Math.round(newSize);
  root.style.setProperty('--light-size', `${newSize}px`);

  cursorLight.style.transform = `translate(${x}px, ${y}px)`;

  const heroRect = hero.getBoundingClientRect();
  const inHero = y >= heroRect.top && y <= heroRect.bottom;
  cursorLight.style.display = inHero ? 'block' : 'none';

  if (inHero) {
    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - wordX, y - wordY);
      if (dist < maxDist) flashWord(word, 1800);
    });
  }

  lastX = x;
  lastY = y;
  lastTime = now;
}

function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX, y = touch.clientY;
  cursorLight.style.transform = `translate(${x}px, ${y}px)`;
  root.style.setProperty('--light-size', `${maxSize}px`);
  setTimeout(() => {
    root.style.setProperty('--light-size', `${minSize}px`);
  }, 200);

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    if (dist < maxDist) flashWord(word, 1800);
  });
}

function handleClick() {
  root.style.setProperty('--light-size', `${maxSize + 100}px`);
  setTimeout(() => {
    root.style.setProperty('--light-size', `${minSize}px`);
  }, 200);
}

function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    flashWord(word, 2000);
    setTimeout(flicker, 1000 + Math.random() * 800);
  };
  flicker();
}

document.addEventListener('click', handleClick);
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchmove', handleTouch);
}

window.addEventListener('DOMContentLoaded', startFlickerLoop);