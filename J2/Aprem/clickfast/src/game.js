class ClickCounter {
  constructor() {
    this.count = 0;
  }

  click() {
    this.count++;
    return this.count;
  }

  reset() {
    this.count = 0;
    return this.count;
  }

  getCount() {
    return this.count;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { ClickCounter };
}
