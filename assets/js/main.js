const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const hero = document.getElementById('hero');
const scrollBtn = document.getElementById('scrollBtn');
const maxDist = 300;

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
      const opacity = Math.max(0, 1 - dist / maxDist);
      word.style.opacity = opacity;
    });
  }
}

function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    const opacity = Math.max(0, 1 - dist / 200);
    if (opacity > 0.3) {
      word.style.opacity = opacity;
      setTimeout(() => (word.style.opacity = 0), 1000);
    }
  });
}

// Scroll to About
scrollBtn?.addEventListener('click', () => {
  const about = document.getElementById('about');
  about.scrollIntoView({ behavior: 'smooth' });
});

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}