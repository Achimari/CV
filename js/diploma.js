import { initStars, drawStars } from './starsBackground.js';

function openModal(id) {
  const modal = document.getElementById(`${id}-modal`);
  if (modal) modal.style.display = 'block';
}

function closeModal(id) {
  const modal = document.getElementById(`${id}-modal`);
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-modal');
      openModal(id);
    });
  });

  document.querySelectorAll('.modal .close').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-close');
      closeModal(id);
    });
  });

  window.onclick = function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  };

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });

  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animateStars() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(ctx, stars, canvas.width, canvas.height);
    requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    stars = initStars(200, canvas.width, canvas.height);
  });

  resizeCanvas();
  stars = initStars(200, canvas.width, canvas.height);
  animateStars();
});
