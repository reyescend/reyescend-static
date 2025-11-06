// Cursor light
const cursorLight = document.querySelector('.cursor-light');
document.addEventListener('mousemove', (e) => {
  cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Trail effect
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
  particles.push({ x: e.clientX, y: e.clientY, alpha: 1 });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    ctx.fillStyle = `rgba(155,0,255,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    p.alpha -= 0.02;
    if (p.alpha <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animate);
}
animate();
