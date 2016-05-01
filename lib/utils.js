exports.dumpBoids = function(boids, label) {
  if (label) console.log(label);
  boids.forEach((boid, idx) => {
    console.log(idx, boid);
  });
  console.log('====');
};
