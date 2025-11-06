const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const maxDist = 300;

// Desktop hover reveal
function handleMouse(e) {
  const x = e.clientX, y = e.clientY;
  cursorLight.style.transform = `translate(${x}px, ${y}px)`;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    const opacity = Math.max(0, 1 - dist / maxDist);
    word.style.opacity = opacity;
  });
}

// Mobile tap reveal
function handleTouch(e) {
  const touch = e.touches[0];
  const x = touch.clientX, y = touch.clientY;

  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - wordX, y - wordY);
    const opacity = Math.max(0, 1 - dist / 200);
    if (opacity > 0.3) {
      word.style.opacity = opacity;
      setTimeout(() => (word.style.opacity = 0), 1200);
    }
  });
}

// Detect device
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}
