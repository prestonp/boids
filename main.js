const Simulator = require('./lib/simulator');
const Gfx = require('./lib/gfx');

let boids = Simulator.initBoids();

function loop() {
  setTimeout(() => {
    window.requestAnimationFrame(loop);
  }, 1);
  Gfx.drawBoids(boids);
  Simulator.moveBoids(boids);
}

loop();
