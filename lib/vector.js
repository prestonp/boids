var Vector = function(x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.add = function(...args) {
  const { x, y } = this;

  if (Array.isArray(args[0]))
    args = args[0]

  return args.reduce((total, vector) => {
    total.x += vector.x;
    total.y += vector.y;
    return total;
  }, new Vector(x, y));
};

module.exports = Vector;
