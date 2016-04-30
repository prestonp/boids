const Vector = require('../lib/vector');
const assert = require('assert');

describe('Vector', () => {
  it('should add vectors and return a vector', () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 9);

    const vector = v1.add(v2);
    assert(vector instanceof Vector);
    assert(vector.x === 4);
    assert(vector.y === 11);

    assert(v1.x !== 4);
    assert(v1.y !== 11);
  });

  it('should add vectors with arrays', () => {
    const v1 = new Vector(1, 5);
    const v2 = new Vector(7, 2);
    const v3 = new Vector(8, 1);

    const vector = v1.add([v2, v3]);
    assert(vector instanceof Vector);
    assert(vector.x === 16);
    assert(vector.y === 8);

    assert(vector !== v1);
  });
});

