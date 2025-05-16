import { initStars, drawStars } from './starsBackground.js';

function lerp(start, end, amt) {
  return start + (end - start) * amt;
}

document.addEventListener("DOMContentLoaded", () => {
  const slimeCanvas = document.getElementById("visual-bg");
  const starsCanvas = document.getElementById("stars-canvas");

  const slimeCtx = slimeCanvas.getContext("2d");
  const starsCtx = starsCanvas.getContext("2d");

  function resizeCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    starsCanvas.style.zIndex = '0';

    slimeCanvas.width = window.innerWidth;
    slimeCanvas.height = window.innerHeight;
    slimeCanvas.style.zIndex = '1000';
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let stars = initStars(200, starsCanvas.width, starsCanvas.height);
  const edgeMargin = 80;
  let x = Math.random() * (slimeCanvas.width - edgeMargin * 2) + edgeMargin;
  let y = Math.random() * (slimeCanvas.height - edgeMargin * 2) + edgeMargin;

  let vx = 0, vy = 0;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let t = 0;

  const baseSize = 140;
  const maxStretch = 40;
  let currentWidth = baseSize;
  let currentHeight = baseSize;

  function draw() {
    starsCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    starsCtx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);
    drawStars(starsCtx, stars, starsCanvas.width, starsCanvas.height);

    slimeCtx.clearRect(0, 0, slimeCanvas.width, slimeCanvas.height);

    const edgeBuffer = 60;
    const nearLeft = x < edgeBuffer;
    const nearRight = x > slimeCanvas.width - edgeBuffer;
    const nearTop = y < edgeBuffer;
    const nearBottom = y > slimeCanvas.height - edgeBuffer;

    let targetW = baseSize;
    let targetH = baseSize;

    if (nearLeft || nearRight) {
      targetW = 70;
      targetH = 180;
    } else if (nearTop || nearBottom) {
      targetW = 180;
      targetH = 70;
    } else {
      const stretchX = vx * 1.5;
      const squishX = Math.max(-maxStretch, Math.min(stretchX, maxStretch));
      const wobbleX = Math.sin(t * 0.1) * 4;
      const wobbleY = Math.cos(t * 0.1) * 4;
      targetW = baseSize + squishX + wobbleX;
      targetH = baseSize - squishX + wobbleY;
    }

    currentWidth = lerp(currentWidth, targetW, 0.08);
    currentHeight = lerp(currentHeight, targetH, 0.08);

    const halfW = currentWidth / 2;
    const halfH = currentHeight / 2;
    x = Math.max(halfW, Math.min(slimeCanvas.width - halfW, x));
    y = Math.max(halfH, Math.min(slimeCanvas.height - halfH, y));

    slimeCtx.beginPath();
    slimeCtx.rect(x - halfW, y - halfH, currentWidth, currentHeight);
    slimeCtx.strokeStyle = "#00ff00";
    slimeCtx.lineWidth = 3;
    slimeCtx.stroke();
    slimeCtx.fillStyle = "rgba(0,255,0,0.07)";
    slimeCtx.fill();

    slimeCtx.fillStyle = "#00ff00";
    slimeCtx.font = "32px monospace";
    slimeCtx.textAlign = "center";
    const face = isDragging ? '（⊙＿⊙）' : '（╹◡╹）';
    slimeCtx.fillText(face, x, y + 10);

    vx *= 0.93;
    vy *= 0.93;
    drawStars(starsCtx, stars, starsCanvas.width, starsCanvas.height);
    t++;
    requestAnimationFrame(draw);
  }

  function checkUnlockZones(pageX, pageY) {
    document.querySelectorAll('.drop-zone').forEach(zone => {
      const rect = zone.getBoundingClientRect();
      const id = zone.dataset.chapter;
      const section = document.querySelector(`.chapter[data-chapter="${id}"]`);

      const inside =
        pageX >= rect.left && pageX <= rect.right &&
        pageY >= rect.top && pageY <= rect.bottom;

      if (section) {
        section.classList.toggle('visible', inside);
      }
    });
  }

  function handleMove(clientX, clientY) {
    if (!isDragging) return;
    const rect = slimeCanvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const newX = mx - dragOffset.x;
    const newY = my - dragOffset.y;
    vx = newX - x;
    vy = newY - y;
    x = newX;
    y = newY;
    checkUnlockZones(clientX, clientY);
  }

  function isInsideSlime(mx, my) {
    const halfW = currentWidth / 2;
    const halfH = currentHeight / 2;
    return (
      mx > x - halfW &&
      mx < x + halfW &&
      my > y - halfH &&
      my < y + halfH
    );
  }

  slimeCanvas.addEventListener("mousedown", (e) => {
    const rect = slimeCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (isInsideSlime(mx, my)) {
      isDragging = true;
      dragOffset.x = mx - x;
      dragOffset.y = my - y;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    vx = 0;
    vy = 0;
    x = Math.round(x);
    y = Math.round(y);
  });

  window.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
  });

  slimeCanvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const rect = slimeCanvas.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    if (isInsideSlime(mx, my)) {
      isDragging = true;
      dragOffset.x = mx - x;
      dragOffset.y = my - y;
    }
  });

  slimeCanvas.addEventListener("touchend", () => {
    isDragging = false;
    vx = 0;
    vy = 0;
    x = Math.round(x);
    y = Math.round(y);
  });

  slimeCanvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  });

  draw();
});
