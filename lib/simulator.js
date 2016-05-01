const Boid = require('./boid');
const Vector = require('./vector');
const MAX_BOIDS = 100;
const dumpBoids = require('./utils').dumpBoids;

function randPos(width=window.innerWidth, height=window.innerHeight) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  return new Vector(x,y);
}

function rule1(boid, idx, boids) {
  // Calculate perceived center of swarm (excluding current boid)
  const center = boids.reduce((total, b, i) => {
    if (b !== boid) {
      total = total.add(b.pos);
    }
    return total;
  }, new Vector(0, 0));

  const n = boids.length - 1;
  return center.div(n).sub(boid.pos).div(100);
}

function rule2(boid, idx, boids) {
  let c = new Vector(0, 0);

  boids.forEach((b, i) => {
    if (b !== boid) {
      let diff = b.pos.sub(boid.pos);
      if (diff.mag() < 10)
        c = c.sub(b.pos.sub(boid.pos));
    }
  });

  return c;
}

function rule3(boid, idx, boids) {
  let vel = new Vector(0, 0);

  boids.forEach((b, i) => {
    if (b !== boid) {
      vel = vel.add(b.vel);
    }
  });

  vel = vel.div(boids.length-1);
  return vel.sub(boid.vel).div(8);
}

function limitVel(vel, limit) {
  const mag = vel.mag();

  if (mag > limit)
    return vel.div(mag).mul(limit);
  return vel;
}

function boundPos(boid) {
  let vel = new Vector(boid.vel.x, boid.vel.y);

  if (boid.pos.x < 0)  {
    vel.x = 10;
  } else if (boid.pos.x > window.innerWidth) {
    vel.x = -10;
  }

  if (boid.pos.y < 0) {
    vel.y = 10;
  } else if (boid.pos.y > window.innerHeight) {
    vel.y = -10;
  }

  return vel;
}

const Simulator = {
  initBoids: function() {
    const boids = [];
    const center = new Vector(window.innerWidth/2, window.innerHeight/2);
    for(let i=0; i<MAX_BOIDS; i++) {
      const pos = randPos();
      const vel = center.sub(pos);
      boids.push(new Boid(pos, vel));
    }
    return boids;
  },

  moveBoids: function(boids) {
    boids = boids.forEach((boid, idx) => {
      const neighbors = boids.filter((b) => {
        return b.pos.sub(boid.pos).mag() < 50;
      });

      let v1 = rule1(boid, idx, neighbors);
      let v2 = rule2(boid, idx, neighbors);
      let v3 = rule3(boid, idx, neighbors);
      boid.vel = boid.vel.add(v1, v2, v3);
      boid.vel = limitVel(boid.vel, 10);
      boid.vel = boundPos(boid);
      boid.pos = boid.pos.add(boid.vel);
    });
    return boids;
  }
};

module.exports = Simulator;
