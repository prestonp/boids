/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var config = __webpack_require__(5);
	var Simulator = __webpack_require__(1);
	var Gfx = __webpack_require__(4);
	var simulator = new Simulator(window.innerWidth, window.innerHeight);
	
	var boids = simulator.initBoids();
	var lastCalledTime = Date.now();
	var fps = 0;
	
	Gfx.onResize(function (width, height) {
	  simulator.width = width;
	  simulator.height = height;
	});
	
	function loop() {
	  var delta = (Date.now() - lastCalledTime) / 1000;
	  lastCalledTime = Date.now();
	  fps = 1 / delta;
	
	  setTimeout(function () {
	    window.requestAnimationFrame(loop);
	  }, config.delay);
	
	  Gfx.clear();
	  Gfx.drawBoids(boids);
	  Gfx.drawFps(fps);
	  simulator.moveBoids(boids);
	}
	
	loop();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var config = __webpack_require__(5);
	var Boid = __webpack_require__(2);
	var Vector = __webpack_require__(3);
	
	var Simulator = function Simulator(width, height) {
	  this.width = width;
	  this.height = height;
	};
	
	Simulator.prototype.rule1 = function (boid, idx, boids) {
	  // Calculate perceived center of swarm (excluding current boid)
	  var center = boids.reduce(function (total, b, i) {
	    if (b !== boid) {
	      total = total.add(b.pos);
	    }
	    return total;
	  }, new Vector(0, 0));
	
	  var n = boids.length - 1;
	  return center.div(n).sub(boid.pos).div(100).mul(config.cohesion);
	};
	
	Simulator.prototype.rule2 = function (boid, idx, boids) {
	  // Repel boids from each other
	  var c = new Vector(0, 0);
	
	  boids.forEach(function (b, i) {
	    if (b !== boid) {
	      var diff = b.pos.sub(boid.pos);
	      if (diff.mag() < config.repelDistance) c = c.sub(b.pos.sub(boid.pos));
	    }
	  });
	
	  return c;
	};
	
	Simulator.prototype.rule3 = function (boid, idx, boids) {
	  // Direction of neighboring boids should influence this boid
	  var vel = new Vector(0, 0);
	
	  boids.forEach(function (b, i) {
	    if (b !== boid) {
	      vel = vel.add(b.vel);
	    }
	  });
	
	  vel = vel.div(boids.length - 1);
	  return vel.sub(boid.vel).div(config.headingFactor);
	};
	
	Simulator.prototype.randPos = function () {
	  var x = Math.random() * this.width;
	  var y = Math.random() * this.height;
	  return new Vector(x, y);
	};
	
	Simulator.prototype.initBoids = function () {
	  var boids = [];
	  var center = new Vector(this.width / 2, this.height / 2);
	  for (var i = 0; i < config.numBoids; i++) {
	    var pos = this.randPos();
	    var vel = center.sub(pos);
	    boids.push(new Boid(pos, vel));
	  }
	  return boids;
	};
	
	Simulator.prototype.limitVel = function (vel, limit) {
	  var mag = vel.mag();
	
	  if (mag > limit) return vel.div(mag).mul(limit);
	  return vel;
	};
	
	Simulator.prototype.boundPos = function (boid) {
	  var vel = new Vector(boid.vel.x, boid.vel.y);
	
	  if (boid.pos.x < 0) {
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
	
	Simulator.prototype.moveBoids = function (boids) {
	  var _this = this;
	
	  boids = boids.forEach(function (boid, idx) {
	    var neighbors = boids.filter(function (b) {
	      return b.pos.sub(boid.pos).mag() < config.neighborRadius;
	    });
	
	    var v1 = _this.rule1(boid, idx, neighbors);
	    var v2 = _this.rule2(boid, idx, neighbors);
	    var v3 = _this.rule3(boid, idx, neighbors);
	    boid.vel = boid.vel.add(v1, v2, v3);
	    boid.vel = _this.limitVel(boid.vel, config.maxVel);
	    boid.vel = _this.boundPos(boid);
	    boid.pos = boid.pos.add(boid.vel);
	  });
	  return boids;
	};
	
	module.exports = Simulator;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var Boid = function Boid(pos, vel) {
	  this.pos = pos;
	  this.vel = vel;
	};
	
	module.exports = Boid;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var Vector = function Vector(x, y) {
	  this.x = x;
	  this.y = y;
	};
	
	function operator(op) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    var x = this.x;
	    var y = this.y;
	
	
	    if (Array.isArray(args[0])) args = args[0];
	
	    return args.reduce(function (total, vector) {
	      if (op === '+') {
	        total.x += vector.x;
	        total.y += vector.y;
	      } else if (op === '-') {
	        total.x -= vector.x;
	        total.y -= vector.y;
	      }
	      return total;
	    }, new Vector(x, y));
	  };
	}
	
	function scalar(op) {
	  return function (val) {
	    if (op === '*') {
	      return new Vector(this.x * val, this.y * val);
	    } else if (op === '/') {
	      if (val === 0) val = 1;
	      return new Vector(this.x / val, this.y / val);
	    }
	  };
	}
	
	Vector.prototype.add = operator('+');
	Vector.prototype.sub = operator('-');
	Vector.prototype.mul = scalar('*');
	Vector.prototype.div = scalar('/');
	
	Vector.prototype.mag = function () {
	  return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	
	Vector.prototype.unit = function (scale) {
	  if (scale) return this.div(this.mag()).mul(scale);
	  return this.div(this.mag());
	};
	
	module.exports = Vector;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var canvas = document.getElementById('boids');
	var ctx = canvas.getContext('2d');
	var Vector = __webpack_require__(3);
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	var width = 5;
	var height = 5;
	
	var Gfx = {
	  clear: function clear() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	  },
	
	  drawBoids: function drawBoids(boids) {
	    boids.forEach(function (boid, idx) {
	      var _boid$pos = boid.pos;
	      var x = _boid$pos.x;
	      var y = _boid$pos.y;
	
	      ctx.fillStyle = "rgb(200,0,0)";
	      ctx.fillRect(x, y, width, height);
	      var boidCenter = boid.pos.add(new Vector(width / 2, height / 2));
	      var heading = boidCenter.add(boid.vel.unit(10));
	      ctx.beginPath();
	      ctx.moveTo(boidCenter.x, boidCenter.y);
	      ctx.lineTo(heading.x, heading.y);
	      ctx.closePath();
	      ctx.stroke();
	    });
	    return boids;
	  },
	
	  drawFps: function drawFps(fps) {
	    ctx.font = "32px helvetica";
	    ctx.fillText(Math.round(fps) + ' fps', 10, 30);
	  },
	
	  onResize: function onResize(callback) {
	    window.addEventListener('resize', function (e) {
	      canvas.width = window.innerWidth;
	      canvas.height = window.innerHeight;
	      callback(window.innerWidth, window.innerHeight);
	    });
	  }
	};
	
	module.exports = Gfx;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	  numBoids: 100,
	  maxVel: 10,
	  neighborRadius: 50,
	  reboundVel: 10,
	  headingFactor: 8, // lower the more uniform
	  repelDistance: 10,
	  cohesion: 1, // percent of attraction to cluster centers
	  delay: 0
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map