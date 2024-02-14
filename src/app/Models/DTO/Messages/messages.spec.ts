import { Messages } from './messages';

describe('Messages', () => {
  it('should create an instance', () => {
    expect(new Messages(1,"TestRun",3,"12:00:00","path/to/pic",1,true,1,1)).toBeTruthy();
  });
});
