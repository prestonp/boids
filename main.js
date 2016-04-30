const Simulator = require('./lib/simulator');
const Gfx = require('./lib/gfx');

let boids = Simulator.initBoids();

while(1) {
  Gfx.drawBoids(boids);
  Simulator.moveBoids(boids);
}
