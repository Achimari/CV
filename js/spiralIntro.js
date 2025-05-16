import { polar } from './utils.js';
import { initStars, drawStars } from './starsBackground.js';

export default class SpiralIntro {
  constructor(canvas, onComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onComplete = onComplete;

    this.stars = [];
    this.particles = [];
    this.t = 0;
    this.running = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const ratio = window.devicePixelRatio || 1;

    this.W = this.canvas.width = window.innerWidth * ratio;
    this.H = this.canvas.height = window.innerHeight * ratio;

    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);

    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;
  }

  start() {
    this.stars = initStars(200, this.W, this.H);
    this.initParticles();
    this.t = 0;
    this.running = true;
    this.phase = 'crawl';

    this.showCrawl().then(() => {
      this.phase = 'hyperdrive';
      requestAnimationFrame(() => this.loop());
    });

    requestAnimationFrame(() => this.loop());
  }

  showCrawl() {
    return new Promise(resolve => {
      const crawlEl = document.getElementById('star-wars-text');
      crawlEl.style.display = 'block';
      crawlEl.style.opacity = 1;

      setTimeout(() => {
        crawlEl.style.transition = 'opacity 2s ease-out';
        crawlEl.style.opacity = 0;

        setTimeout(() => {
          crawlEl.style.display = 'none';
          resolve();
        }, 2000);
      }, 16000);
    });
  }

  initParticles(count = 250) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        angle: Math.random() * 2 * Math.PI,
        distance: Math.random(),
        speed: 0.04 + Math.random() * 0.05,
      });
    }
  }

  loop() {
    if (!this.running) return;

    const ctx = this.ctx;
    drawStars(ctx, this.stars, this.W, this.H);

    if (this.phase === 'hyperdrive') {
      this.particles.forEach(p => {
        p.distance -= p.speed * (2 + this.t * 0.3);

        if (p.distance < 0) {
          p.distance = 1;
          p.angle = Math.random() * 2 * Math.PI;
        }

        const maxTunnelRadius = Math.sqrt(this.W ** 2 + this.H ** 2) * 0.5;
        const radius = p.distance * maxTunnelRadius;
        const spiralAmount = 0.15;
        const angleWithTwist = p.angle + p.distance * spiralAmount;

        const [sx, sy] = polar(radius, angleWithTwist);
        const lineLength = 50 + 300 * (1 - p.distance);
        const [ex, ey] = polar(radius + lineLength, angleWithTwist);

        ctx.lineWidth = 0.5 + (1 - p.distance) * 3;
        ctx.strokeStyle = `rgba(255, 255, ${200 + Math.floor(55 * (1 - p.distance))}, ${Math.min(1, p.distance * 2)})`;

        ctx.beginPath();
        ctx.moveTo(this.cx + sx, this.cy + sy);
        ctx.lineTo(this.cx + ex, this.cy + ey);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, p.distance * 2)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.cx + sx, this.cy + sy);
        ctx.lineTo(this.cx + ex, this.cy + ey);
        ctx.stroke();
      });

      this.t += 0.035;
      if (this.t > 3.5) {
        this.phase = 'done';
        this.canvas.style.opacity = 0;
        this.onComplete();
      } else {
        requestAnimationFrame(() => this.loop());
      }
    } else {
      requestAnimationFrame(() => this.loop());
    }
  }
}
