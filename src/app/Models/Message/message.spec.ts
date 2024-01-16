import { Message } from './message';

describe('Message', () => {
  it('should create an instance', () => {
    expect(new Message(1,"TestRun",3,"12:00:00","path/to/pic",1,true)).toBeTruthy();
  });
});
