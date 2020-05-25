const log = require("debug")("zmachine.point");

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
}

module.exports = Point;
