const Boid = require('./boid');
const Vector = require('./vector');
const MAX_BOIDS = 10;

function randPos(width=1000, height=1000) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  return new Vector(x,y);
}

function rule1(boid, idx, boids) {
  // Calculate perceived center of swarm (excluding current boid)
  const center = boids.reduce((total, b, i) => {
    if (i !== idx) {
      total = total.add(b.pos);
    }
    return total;
  }, new Vector(0, 0));

  const n = boids.length - 1;

  center.x /= n;
  center.y /= n;

  return center.sub(boid.pos).div(100);
}

function rule2(boid, idx, boids) {
  let c = new Vector(0, 0);

  boids.forEach((b, i) => {
    if (i !== idx) {
      let diff = b.pos.sub(boid.pos);
      if (diff.mag() < 10)
        c = c.sub(diff);
    }
  });

  return c;
}

function limitVel(vel) {
  const limit = 10;
  const mag = vel.mag();

  if (mag > limit)
    return vel.div(mag).mul(limit);
  return vel;
}

const Simulator = {
  initBoids: function() {
    const boids = [];
    for(let i=0; i<MAX_BOIDS; i++) {
      const pos = randPos();
      const vel = new Vector(0, 0);
      boids.push(new Boid(pos, vel));
    }
    return boids;
  },

  moveBoids: function(boids) {
    boids = boids.forEach((boid, idx) => {
      let v1 = rule1(boid, idx, boids);
      let v2 = rule2(boid, idx, boids);
      boid.vel = boid.vel.add(v1, v2);
      // boid.vel = limitVel(boid.vel);
      boid.pos = boid.pos.add(boid.vel);
    });
    return boids;
  }
};

module.exports = Simulator;
