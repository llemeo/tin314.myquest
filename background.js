/**
 * Dynamic luminous floating orbs / particles canvas background
 * Slow movement, soft glowing radial gradients creating authentic frosted glass diffusion
 */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = [
    { r: 0, g: 240, b: 255 },    // Neon Cyan
    { r: 255, g: 0, b: 127 },    // Neon Pink
    { r: 140, g: 60, b: 255 },   // Neon Violet
    { r: 0, g: 255, b: 136 },    // Neon Emerald
    { r: 70, g: 90, b: 255 },    // Cyber Blue
    { r: 255, g: 215, b: 0 }     // Soft Amber
  ];

  class Orb {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.radius = Math.random() * 110 + 60; // 60 - 170px radius
      this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? -this.radius : width + this.radius);
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.22 + 0.12; // 0.12 - 0.34
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulsePhase += this.pulseSpeed;

      // Wrap around gently
      if (this.x < -this.radius * 2) this.x = width + this.radius;
      if (this.x > width + this.radius * 2) this.x = -this.radius;
      if (this.y < -this.radius * 2) this.y = height + this.radius;
      if (this.y > height + this.radius * 2) this.y = -this.radius;
    }
    draw() {
      const currentAlpha = this.alpha * (0.8 + 0.2 * Math.sin(this.pulsePhase));
      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      const c = this.color;
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${currentAlpha})`);
      grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${currentAlpha * 0.4})`);
      grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const orbs = [];
  const ORB_COUNT = 18;
  for (let i = 0; i < ORB_COUNT; i++) {
    orbs.push(new Orb());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle dark cyber ambient gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0B0050');
    bgGrad.addColorStop(0.5, '#08003a');
    bgGrad.addColorStop(1, '#050028');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let orb of orbs) {
      orb.update();
      orb.draw();
    }

    requestAnimationFrame(render);
  }
  render();
})();
