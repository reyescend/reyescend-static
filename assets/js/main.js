const cursorLight = document.querySelector('.cursor-light');
const words = Array.from(document.querySelectorAll('.hidden-words span'));
const hero = document.getElementById('hero');
const root = document.documentElement;
const maxDist = 250;

let lastX = 0, lastY = 0, lastTime = Date.now();
const minSize = 300, maxSize = 600;
const speedThreshold = 1000;

// initialise word opacity hidden
words.forEach(word => word.style.opacity = '0');

// flash word function
function flashWord(word, duration = 1800) {
  word.style.opacity = '1';
  if (word._timeout) clearTimeout(word._timeout);
  word._timeout = setTimeout(() => {
    word.style.opacity = '0';
  }, duration);
}

// check pointer in hero
function isInHero(x, y) {
  const rect = hero.getBoundingClientRect();
  return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
}

// handle mouse movement
function handleMouse(e) {
  const x = e.clientX, y = e.clientY;
  const now = Date.now();
  const dx = x - lastX, dy = y - lastY;
  const dt = now - lastTime;
  const dist = Math.hypot(dx, dy);
  const speed = dist / (dt || 1);

  let newSize = minSize + (Math.min(speed, speedThreshold) / speedThreshold) * (maxSize - minSize);
  newSize = Math.round(newSize);
  root.style.setProperty('--light-size', `${newSize}px`);

  cursorLight.style.transform = `translate(${x}px, ${y}px)`;

  if (isInHero(x, y)) {
    cursorLight.style.display = 'block';
    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      const dist2 = Math.hypot(x - wordX, y - wordY);
      if (dist2 < maxDist) {
        flashWord(word, 1800);
      }
    });
  } else {
    cursorLight.style.display = 'none';
  }

  lastX = x; lastY = y; lastTime = now;
}

// handle touch input
function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX, y = touch.clientY;
  cursorLight.style.transform = `translate(${x}px, ${y}px)`;
  root.style.setProperty('--light-size', `${maxSize}px`);
  setTimeout(() => {
    root.style.setProperty('--light-size', `${minSize}px`);
  }, 200);

  if (isInHero(x, y)) {
    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      const dist2 = Math.hypot(x - wordX, y - wordY);
      if (dist2 < maxDist) {
        flashWord(word, 1800);
      }
    });
  }
}

// scroll to section utility
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// flicker loop for words
function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    flashWord(word, 2000);
    setTimeout(flicker, 1000 + Math.random() * 800);
  };
  flicker();
}

// initialization depending on screen width
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
  startFlickerLoop();
} else {
  document.addEventListener('touchstart', handleTouch);
}