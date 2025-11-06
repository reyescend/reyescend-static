const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const hero = document.getElementById('hero');
const scrollBtn = document.getElementById('scrollBtn');
const maxDist = 250;

// Flash a word temporarily
function flashWord(word, duration = 1000) {
  word.style.opacity = '1';
  clearTimeout(word._flashTimeout);
  word._flashTimeout = setTimeout(() => {
    word.style.opacity = '';
  }, duration);
}

// Mouse move for desktop
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
      if (dist < maxDist) {
        flashWord(word, 1000);
      }
    });
  }
}

// Tap reveal on mobile
function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    if (dist < maxDist) {
      flashWord(word, 1000);
    }
  });
}

// Random flicker loop
function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    flashWord(word, 800 + Math.random() * 600);
    setTimeout(flicker, 600 + Math.random() * 1000);
  };
  flicker();
}

// Scroll button
scrollBtn?.addEventListener('click', () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
});

// Listeners
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}

window.addEventListener('DOMContentLoaded', () => {
  startFlickerLoop();
});