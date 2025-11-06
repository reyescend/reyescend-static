// Cursor light reveal effect
const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');

// Track cursor
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  cursorLight.style.transform = `translate(${x}px, ${y}px)`;

  words.forEach((word) => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    const maxDist = 250; // reveal radius in px

    const opacity = Math.max(0, 1 - dist / maxDist);
    word.style.opacity = opacity;
  });
});
