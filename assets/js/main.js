const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const lightSize = 500;
const revealRadius = 250;
let animationFrame;

// Ensure all words start hidden
words.forEach(word => {
  word.style.opacity = '0';
});

// Flash words momentarily
function flashWord(word, duration = 1200) {
  word.style.opacity = '1';
  clearTimeout(word._flashTimeout);
  word._flashTimeout = setTimeout(() => {
    word.style.opacity = '0';
  }, duration);
}

// Reveal on mousemove
function handleMouse(e) {
  if (!document.body.classList.contains('in-hero')) return;

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

// Reveal on touch
function handleTouch(e) {
  if (!document.body.classList.contains('in-hero')) return;

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

// Star flicker in hero only
function startFlickerLoop() {
  const flicker = () => {
    if (!document.body.classList.contains('in-hero')) {
      setTimeout(flicker, 500);
      return;
    }

    const word = words[Math.floor(Math.random() * words.length)];
    word.style.transition = 'opacity 0.6s ease';
    flashWord(word, 1200 + Math.random() * 500);
    setTimeout(flicker, 800 + Math.random() * 1000);
  };
  flicker();
}

// Check if in hero
function trackHeroView() {
  const hero = document.getElementById('hero');
  const heroRect = hero.getBoundingClientRect();
  const inHero = heroRect.bottom > 200;
  document.body.classList.toggle('in-hero', inHero);
}

// Fade in sections
function revealSectionsOnScroll() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      section.classList.add('revealed');
    }
  });
}

// Init
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}

window.addEventListener('scroll', () => {
  trackHeroView();
  revealSectionsOnScroll();
});

window.addEventListener('DOMContentLoaded', () => {
  trackHeroView();
  revealSectionsOnScroll();
});

startFlickerLoop();