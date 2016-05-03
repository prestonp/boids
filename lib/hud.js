const config = require('../config');
const gui = new dat.GUI();

gui.add(config, 'numBoids', 1, 200);
gui.add(config, 'maxVel', 1, 100);
gui.add(config, 'neighborRadius', 5, 100);
gui.add(config, 'reboundVel');
gui.add(config, 'headingFactor', 1, 20);
gui.add(config, 'repelDistance', 5, 20);
gui.add(config, 'cohesion', 1, 20);
gui.add(config, 'delay');
