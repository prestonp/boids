let canvas = document.getElementById('boids');
let ctx = canvas.getContext('2d');

const width = 2;
const height = 2;

const Gfx = {
  drawBoids: function(boids) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boids.forEach((boid) => {
      const { x, y } = boid.pos;
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.fillRect(x, y, width, height);
    });
    return boids;
  }
};

module.exports = Gfx;
