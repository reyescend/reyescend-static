const cursorLight = document.querySelector('.cursor-light');
const words = document.querySelectorAll('.hidden-words span');
const maxDist = 500;  // increased distance threshold for visibility
let animationFrame;

function handleMouse(e) {
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(() => {
    const x = e.clientX, y = e.clientY;
    // offset by half of light size (170px) for center alignment
    cursorLight.style.transform = `translate(${x - 170}px, ${y - 170}px)`;

    words.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - wordX, y - wordY);
      const opacity = Math.max(0, 1 - dist / maxDist);
      word.style.opacity = opacity;
    });
  });
}

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
      clearTimeout(word._timeout);
      word.style.opacity = opacity;
      word._timeout = setTimeout(() => {
        word.style.opacity = 0;
      }, 1000);
    }
  });
}

// Setup event listeners based on screen width
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', handleMouse);
} else {
  document.addEventListener('touchstart', handleTouch);
}
