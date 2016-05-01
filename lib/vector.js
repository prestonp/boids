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
