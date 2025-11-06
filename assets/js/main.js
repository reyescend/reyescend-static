// Cursor light effect only (no trail)
const cursorLight = document.querySelector('.cursor-light');

document.addEventListener('mousemove', (e) => {
  cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Optional soft follow (uncomment for smoother movement)
/*
let mouseX = 0, mouseY = 0, lightX = 0, lightY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  lightX += (mouseX - lightX) * 0.1;
  lightY += (mouseY - lightY) * 0.1;
  cursorLight.style.transform = `translate(${lightX}px, ${lightY}px)`;
  requestAnimationFrame(animate);
}
animate();
*/
