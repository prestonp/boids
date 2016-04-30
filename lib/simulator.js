const Boid = require('./boid');
const Vector = require('./vector');
const MAX_BOIDS = 100;

const Simulator = {
  initBoids: function() {
    const boids = [];
    for(let i=0; i<MAX_BOIDS; i++) {
      const pos = new Vector(0, 0);
      const vel = new Vector(0, 0);
      boids.push(new Boid(pos, vel));
    }
    return boids;
  },

  moveBoids: function(boids) {
    return boids;
  }
};

module.exports = Simulator;
