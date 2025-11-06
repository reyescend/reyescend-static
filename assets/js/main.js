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
  if (word._timeout) clearTimeout(word._timeout);
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
      if (dist2 < maxDist) flashWord(word);
    });
  } else {
    cursorLight.style.display = 'none';
  }

  lastX = x; lastY = y; lastTime = now;
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

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
  startFlickerLoop();
} else {
  document.addEventListener('touchstart', e => {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    if (isInHero(x, y)) {
      words.forEach(word => {
        const rect = word.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;
        const dist = Math.hypot(x - wordX, y - wordY);
        if (dist < maxDist) flashWord(word);
      });
    }
  });
}