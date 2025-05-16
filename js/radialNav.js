import { initStars, drawStars } from './starsBackground.js';

document.addEventListener('DOMContentLoaded', () => {
  const redPill = document.getElementById('red-pill');
  const nav = document.getElementById('main-nav');
  const items = document.querySelectorAll('.orbit-nav li');

  let isOpen = false;
  let orbitAnimationFrame;
  let starsAnimationFrame;

  const canvas = document.createElement('canvas');
  canvas.id = 'star-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '0',
    pointerEvents: 'none'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  let stars = initStars(400, W, H);

  function animateStarsOnly() {
    drawStars(ctx, stars, W, H);
    starsAnimationFrame = requestAnimationFrame(animateStarsOnly);
  }

  const orbits = [];
  const total = items.length;
  const colors = ['#0f0', '#f0f', '#0ff', '#ff0', '#f00', '#0f9'];

  items.forEach((item, i) => {
    const baseAngle = (i / total) * 2 * Math.PI;
    const angleChaos = Math.random() * (Math.PI / total);
    const speed = 0.008 + Math.random() * 0.007;

    const maxRadius = Math.min(W, H) / 2.5;

    orbits.push({
      angleOffset: baseAngle + angleChaos,
      radius: maxRadius * (0.7 + Math.random() * 0.3),
      speed: speed,
      defaultSpeed: speed,
      slowedSpeed: speed * 0.2,
      color: colors[i % colors.length]
    });

    item.addEventListener('mouseenter', () => {
      orbits[i].speed = orbits[i].slowedSpeed;
    });
    item.addEventListener('mouseleave', () => {
      orbits[i].speed = orbits[i].defaultSpeed;
    });
  });

  function animateOrbit() {
    drawStars(ctx, stars, W, H);

    items.forEach((item, i) => {
      const orbit = orbits[i];
      orbit.angleOffset += orbit.speed;

      const angle = orbit.angleOffset - Math.PI / 2;
      const x = Math.cos(angle) * orbit.radius;
      const y = Math.sin(angle) * orbit.radius;

      item.style.transform = `translate(${x}px, ${y}px)`;
    });

    orbitAnimationFrame = requestAnimationFrame(animateOrbit);
  }

  function openNav() {
    redPill.style.display = 'none';
    nav.classList.add('open');
    items.forEach(item => {
      item.style.opacity = 1;
      item.style.pointerEvents = 'auto';
    });
    cancelAnimationFrame(starsAnimationFrame);
    animateOrbit();
    isOpen = true;
  }

  function closeNav() {
    nav.classList.remove('open');
    cancelAnimationFrame(orbitAnimationFrame);
    items.forEach(item => {
      item.style.transform = `translate(0, 0)`;
      item.style.opacity = 0;
      item.style.pointerEvents = 'none';
    });
    redPill.style.display = 'block';
    isOpen = false;
    animateStarsOnly();
  }

  redPill.addEventListener('click', openNav);

  document.addEventListener('click', (e) => {
    if (isOpen && !nav.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') {
      closeNav();
    }
  });

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    stars = initStars(400, W, H);

    const maxRadius = Math.min(W, H) / 2.5;
    orbits.forEach(orbit => {
      orbit.radius = maxRadius * (0.7 + Math.random() * 0.3);
    });
  });

  animateStarsOnly();
});
