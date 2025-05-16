import { startIntroAnimation } from './main.js';

const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let columns;
const fontSize = 18;
let drops;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  columns = Math.floor(width / fontSize);
  drops = new Array(columns).fill(1);
}
resize();
window.addEventListener('resize', resize);

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()+=<>?';
const lettersArr = letters.split('');

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = lettersArr[Math.floor(Math.random() * lettersArr.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  requestAnimationFrame(draw);
}
draw();

const input = document.getElementById('console-input');
const message = document.getElementById('console-message');
const matrixCanvas = document.getElementById('matrix-canvas');
const introCanvas = document.getElementById('intro-canvas');
const consoleContainer = document.getElementById('console-input-container');
const nav = document.getElementById('main-nav');


function normalizeQuery(query) {
  return query
    .toUpperCase()
    .replace(/\s+/g, ' ')   
    .trim();                
}

const VALID_QUERY = 'SELECT * FROM JOMA';

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = normalizeQuery(input.value);
    if (val === VALID_QUERY) {
      message.textContent = 'ACCESS GRANTED. LAUNCHING...';
      fadeOutMatrixAndStartIntro();
    } else {
      message.textContent = 'INVALID QUERY. TRY: SELECT * FROM JOMA';
      input.value = '';
    }
  }
});

function fadeOutMatrixAndStartIntro() {
    let opacity = 1;
    function fade() {
      opacity -= 0.03;
      if (opacity <= 0) {
        matrixCanvas.style.display = 'none';
        consoleContainer.style.display = 'none';
  
        introCanvas.style.display = 'block';
        introCanvas.style.opacity = '1';
    
        startIntroAnimation();
        return;
      }
      matrixCanvas.style.opacity = opacity;
      consoleContainer.style.opacity = opacity;
      requestAnimationFrame(fade);
    }
    fade();
  }