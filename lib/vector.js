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
