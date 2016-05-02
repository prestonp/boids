const config = require('./config');
const Simulator = require('./lib/simulator');
const Gfx = require('./lib/gfx');
const simulator = new Simulator(window.innerWidth, window.innerHeight);

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

  Gfx.clear();
  Gfx.drawBoids(boids);
  Gfx.drawFps(fps);
  simulator.moveBoids(boids);
}

loop();
