const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const lightSize = 500;
const revealRadius = 250;
let animationFrame;

// Hide all words initially
words.forEach(word => {
  word.style.opacity = 0;
});

// Reveal with flash + auto-hide
function revealWord(word, duration = 1000) {
  word.style.opacity = 1;
  clearTimeout(word._timeout);
  word._timeout = setTimeout(() => {
    word.style.opacity = 0;
  }, duration);
}

// Mouse interaction
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
        revealWord(word, 1000);
      }
    });
  });
}

// Mobile touch
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
      revealWord(word, 1000);
    }
  });
}

// Random flicker
function randomFlicker() {
  const word = words[Math.floor(Math.random() * words.length)];
  revealWord(word, 500 + Math.random() * 700);

  setTimeout(randomFlicker, 400 + Math.random() * 1200);
}

// Init
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}
randomFlicker();