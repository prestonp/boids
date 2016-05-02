const Simulator = require('../lib/simulator');
const assert = require('assert');

describe('Simulator', () => {
  it('should init boids', () => {
    let sim = new Simulator(10, 10);
    let boids = sim.initBoids();
    assert(boids.length);
  });
});
