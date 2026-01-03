import { add } from '../math';

describe('add', () => {
  it('1 + 1은 2다', () => {
    expect(add(1, 1)).toBe(2);
  });
});
