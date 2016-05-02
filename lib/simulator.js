const config = require('../config');
const Boid = require('./boid');
const Vector = require('./vector');

const Simulator = function(width, height) {
  this.width = width;
  this.height = height;
};

Simulator.prototype.rule1 = function(boid, idx, boids) {
  // Calculate perceived center of swarm (excluding current boid)
  const center = boids.reduce((total, b, i) => {
    if (b !== boid) {
      total = total.add(b.pos);
    }
    return total;
  }, new Vector(0, 0));

  const n = boids.length - 1;
  return center.div(n).sub(boid.pos).div(100).mul(config.cohesion);
};

Simulator.prototype.rule2 = function(boid, idx, boids) {
  // Repel boids from each other
  let c = new Vector(0, 0);

  boids.forEach((b, i) => {
    if (b !== boid) {
      let diff = b.pos.sub(boid.pos);
      if (diff.mag() < config.repelDistance)
        c = c.sub(b.pos.sub(boid.pos));
    }
  });

  return c;
};

Simulator.prototype.rule3 = function(boid, idx, boids) {
  // Direction of neighboring boids should influence this boid
  let vel = new Vector(0, 0);

  boids.forEach((b, i) => {
    if (b !== boid) {
      vel = vel.add(b.vel);
    }
  });

  vel = vel.div(boids.length-1);
  return vel.sub(boid.vel).div(config.headingFactor);
};

Simulator.prototype.randPos = function() {
  const x = Math.random() * this.width;
  const y = Math.random() * this.height;
  return new Vector(x,y);
}

Simulator.prototype.initBoids = function() {
  const boids = [];
  const center = new Vector(this.width/2, this.height/2);
  for(let i=0; i<config.numBoids; i++) {
    const pos = this.randPos();
    const vel = center.sub(pos);
    boids.push(new Boid(pos, vel));
  }
  return boids;
};

Simulator.prototype.limitVel = function(vel, limit) {
  const mag = vel.mag();

  if (mag > limit)
    return vel.div(mag).mul(limit);
  return vel;
};

Simulator.prototype.boundPos = function(boid) {
  let vel = new Vector(boid.vel.x, boid.vel.y);

  if (boid.pos.x < 0)  {
    vel.x = config.reboundVel;
  } else if (boid.pos.x > this.width) {
    vel.x = -config.reboundVel;
  }

  if (boid.pos.y < 0) {
    vel.y = config.reboundVel;
  } else if (boid.pos.y > this.height) {
    vel.y = -config.reboundVel;
  }

  return vel;
};

Simulator.prototype.moveBoids = function(boids) {
  boids = boids.forEach((boid, idx) => {
    const neighbors = boids.filter((b) => {
      return b.pos.sub(boid.pos).mag() < config.neighborRadius;
    });

    let v1 = this.rule1(boid, idx, neighbors);
    let v2 = this.rule2(boid, idx, neighbors);
    let v3 = this.rule3(boid, idx, neighbors);
    boid.vel = boid.vel.add(v1, v2, v3);
    boid.vel = this.limitVel(boid.vel, config.maxVel);
    boid.vel = this.boundPos(boid);
    boid.pos = boid.pos.add(boid.vel);
  });
  return boids;
};

module.exports = Simulator;
