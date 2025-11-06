const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const lightSize = 500;
const revealRadius = 250;
let animationFrame;

// 🔒 Start hidden
words.forEach(word => {
  word.style.opacity = '0';
});

// ✨ Flash in/out momentarily
function flashWord(word, duration = 800) {
  word.style.opacity = '1';
  clearTimeout(word._flashTimeout);
  word._flashTimeout = setTimeout(() => {
    word.style.opacity = '0';
  }, duration);
}

// 🖱️ Hover to reveal
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
        flashWord(word, 1000);
      }
    });
  });
}

// 📱 Touch to reveal
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
      flashWord(word, 1000);
    }
  });
}

// 🌟 Random twinkling
function startFlickerLoop() {
  const flicker = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    flashWord(word, 300 + Math.random() * 400);
    setTimeout(flicker, 400 + Math.random() * 800);
  };
  flicker();
}

// 📡 Event binding
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}

// 🎬 Activate twinkles
startFlickerLoop();