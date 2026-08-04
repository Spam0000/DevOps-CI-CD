const { ClickCounter } = require('../src/game');

describe('ClickCounter', () => {
  test('demarre a 0', () => {
    const counter = new ClickCounter();
    expect(counter.getCount()).toBe(0);
  });

  test('incremente de 1 a chaque clic', () => {
    const counter = new ClickCounter();
    counter.click();
    counter.click();
    expect(counter.getCount()).toBe(2);
  });

  test('retourne le nouveau score apres clic', () => {
    const counter = new ClickCounter();
    expect(counter.click()).toBe(1);
    expect(counter.click()).toBe(2);
  });

  test('reset remet le compteur a 0', () => {
    const counter = new ClickCounter();
    counter.click();
    counter.click();
    counter.click();
    counter.reset();
    expect(counter.getCount()).toBe(0);
  });

  test('reset retourne 0', () => {
    const counter = new ClickCounter();
    counter.click();
    expect(counter.reset()).toBe(0);
  });
});
