const Simulator = require('../lib/simulator');
const assert = require('assert');

describe('Simulator', () => {
  it('should init boids', () => {
    let boids = Simulator.initBoids();
    assert(boids.length);
  });
});
