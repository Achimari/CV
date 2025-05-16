import SpiralIntro from './spiralIntro.js';

let introInstance = null;

export function startIntroAnimation() {
  if (introInstance) return;
  const canvas = document.getElementById('intro-canvas');
  const nav = document.getElementById('main-nav');

  introInstance = new SpiralIntro(canvas, () => {
    window.location.href = 'nav.html'; 
  });
  introInstance.start();
}
