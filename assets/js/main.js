const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const lightSize = 500;
const revealRadius = 250;
let animationFrame;

// Initialize opacity
words.forEach(word => {
  word.style.opacity = '0';
});

// Reveal with fade out
function flashWord(word, duration = 1200) {
  word.style.opacity = '1';
  clearTimeout(word._flashTimeout);
  word._flashTimeout = setTimeout(() => {
    word.style.opacity = '0';
  }, duration);
}

// Hover reveal
function handleMouse(e) {
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(() => {
    const x = e.clientX;
    const y = e.clientY;
    cursorLight.style.transform = `translate(${x - lightSize / 2}px, ${y - lightSize / 2 + 10}px)`;

    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - wordX, y - wordY);
      if (dist < revealRadius) {
        flashWord(word, 1200);
      }
    });
  });
}

// Tap reveal
function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    if (dist < revealRadius) {
      flashWord(word, 1200);
    }
  });
}

// Random flicker loop
function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    word.style.transition = 'opacity 0.6s ease';
    flashWord(word, 1200 + Math.random() * 500);
    setTimeout(flicker, 800 + Math.random() * 1000);
  };
  flicker();
}

// Init
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}
startFlickerLoop();