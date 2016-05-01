let canvas = document.getElementById('boids');
let ctx = canvas.getContext('2d');
const dumpBoids = require('./utils').dumpBoids;
const Vector = require('./vector');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const width = 5;
const height = 5;

const Gfx = {
  drawBoids: function(boids) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  }
};

module.exports = Gfx;
