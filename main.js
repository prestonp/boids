const config = require('./config');
const Simulator = require('./lib/simulator');
const Gfx = require('./lib/gfx');
const simulator = new Simulator(window.innerWidth, window.innerHeight);
require('./lib/hud');

let boids = simulator.initBoids();
let lastCalledTime = Date.now();
let fps = 0;

Gfx.onResize((width, height) => {
  simulator.width = width;
  simulator.height = height;
});

function loop() {
  const delta = (Date.now() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps = 1/delta;

  setTimeout(() => {
    window.requestAnimationFrame(loop);
  }, config.delay);

  const subset = boids.slice(0, config.numBoids);

  Gfx.clear();
  Gfx.drawBoids(subset);
  Gfx.drawFps(fps);
  simulator.moveBoids(subset);
}

loop();
