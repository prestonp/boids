let canvas = document.getElementById('boids');
let ctx = canvas.getContext('2d');
const Vector = require('./vector');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const width = 5;
const height = 5;

const Gfx = {
  clear: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  drawBoids: function(boids) {
    boids.forEach((boid, idx) => {
      const { x, y } = boid.pos;
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.fillRect(x, y, width, height);
      const boidCenter = boid.pos.add(new Vector(width/2, height/2));
      const heading = boidCenter.add(boid.vel.unit(10));
      ctx.beginPath();
      ctx.moveTo(boidCenter.x, boidCenter.y);
      ctx.lineTo(heading.x, heading.y);
      ctx.closePath();
      ctx.stroke();
    });
    return boids;
  },

  drawFps: function(fps) {
    ctx.font = "32px helvetica";
    ctx.fillText(Math.round(fps) + ' fps', 10, 30);
  },

  onResize: function(callback) {
    window.addEventListener('resize', (e) => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      callback(window.innerWidth, window.innerHeight);
    });
  }
};

module.exports = Gfx;
