export function initStars(count, width, height) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: 0.2 + Math.random() * 0.5,
      });
    }
    return stars;
  }
  
  export function drawStars(ctx, stars, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
  
    ctx.fillStyle = 'white';
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  