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

	const Simulator = __webpack_require__(1);
	const Gfx = __webpack_require__(4);
	
	let boids = Simulator.initBoids();
	
	function loop() {
	  setTimeout(() => {
	    window.requestAnimationFrame(loop);
	  }, 10);
	  Gfx.drawBoids(boids);
	  Simulator.moveBoids(boids);
	}
	
	loop();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Boid = __webpack_require__(2);
	const Vector = __webpack_require__(3);
	const MAX_BOIDS = 100;
	const dumpBoids = __webpack_require__(5).dumpBoids;
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Boid = function(pos, vel) {
	  this.pos = pos;
	  this.vel = vel;
	};
	
	module.exports = Boid;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Vector = function(x, y) {
	  this.x = x;
	  this.y = y;
	};
	
	function operator(op) {
	  return function(...args) {
	    const { x, y } = this;
	
	    if (Array.isArray(args[0]))
	      args = args[0];
	
	    return args.reduce((total, vector) => {
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
	  return function(val) {
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
	
	Vector.prototype.mag = function() {
	  return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	
	Vector.prototype.unit = function(scale) {
	  if (scale) return this.div(this.mag()).mul(scale);
	  return this.div(this.mag());
	};
	
	module.exports = Vector;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	let canvas = document.getElementById('boids');
	let ctx = canvas.getContext('2d');
	const dumpBoids = __webpack_require__(5).dumpBoids;
	const Vector = __webpack_require__(3);
	
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	
	const width = 5;
	const height = 5;
	
	const Gfx = {
	  drawBoids: function(boids) {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    boids.forEach((boid, idx) => {
	      const { x, y } = boid.pos;
	      ctx.fillStyle = "rgb(200,0,0)";
	      ctx.fillRect(x, y, width, height);
	      const boidCenter = boid.pos.add(new Vector(width/2, height/2));
	      const heading = boidCenter.add(boid.vel.unit(10));
	      ctx.beginPath();
	      ctx.moveTo(boidCenter.x, boidCenter.y);
	      ctx.lineTo(heading.x, heading.y);
	      ctx.closePath();
	      ctx.stroke();
	    });
	    return boids;
	  }
	};
	
	module.exports = Gfx;


/***/ },
/* 5 */
/***/ function(module, exports) {

	exports.dumpBoids = function(boids, label) {
	  if (label) console.log(label);
	  boids.forEach((boid, idx) => {
	    console.log(idx, boid);
	  });
	  console.log('====');
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map