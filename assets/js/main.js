const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const hero = document.getElementById('hero');
const maxDist = 250;

// Hide all words initially
words.forEach(word => word.style.opacity = '0');

// Temporarily show a word
function flashWord(word, duration = 1800) {
  word.style.opacity = '1';
  clearTimeout(word._timeout);
  word._timeout = setTimeout(() => {
    word.style.opacity = '0';
  }, duration);
}

// Mouse hover reveal
function handleMouse(e) {
  const x = e.clientX;
  const y = e.clientY;
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
      if (dist < maxDist) flashWord(word, 1000);
    });
  }
}

// Tap reveal
function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX, y = touch.clientY;
  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    if (dist < maxDist) flashWord(word, 1200);
  });
}

// Random flicker (off → on → off)
function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    flashWord(word, 600 + Math.random() * 800);
    setTimeout(flicker, 700 + Math.random() * 1200);
  };
  flicker();
}

// Event listeners
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}

window.addEventListener('DOMContentLoaded', startFlickerLoop);