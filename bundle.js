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
	  }, 1);
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
	
	function randPos(width=window.innerWidth, height=window.innerHeight) {
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
	
	function rule3(boid, idx, boids) {
	  let vel = new Vector(0, 0);
	
	  boids.forEach((b, i) => {
	    if (idx !== i) {
	      vel.add(b.vel);
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
	      let v3 = rule3(boid, idx, boids);
	      boid.vel = boid.vel.add(v1, v2, v3);
	      boid.vel = limitVel(boid.vel, 10);
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
	      return new Vector(this.x / val, this.y / val);
	    }
	  };
	}
	
	Vector.prototype.add = operator('+');
	Vector.prototype.sub = operator('-');
	Vector.prototype.mul = scalar('*');
	Vector.prototype.div = scalar('/');
	Vector.prototype.mag = function() {
	  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};
	
	module.exports = Vector;


/***/ },
/* 4 */
/***/ function(module, exports) {

	let canvas = document.getElementById('boids');
	let ctx = canvas.getContext('2d');
	
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	
	const width = 5;
	const height = 5;
	
	const Gfx = {
	  drawBoids: function(boids) {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    boids.forEach((boid) => {
	      const { x, y } = boid.pos;
	      ctx.fillStyle = "rgb(200,0,0)";
	      ctx.fillRect(x, y, width, height);
	    });
	    return boids;
	  }
	};
	
	module.exports = Gfx;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map