import { TestRequest } from '../messages/messages.mocks';
import { PlainObjectMessageException } from './exceptions';
import { ExecutorUtils } from './executor-utils';

describe('ExecutorUtils', () => {
  describe('get type of message', () => {
    it('should get prototype of object', () => {
      expect(ExecutorUtils.getTypeOfMessage(new TestRequest())).toBe(TestRequest);
    });

    it('should throw PlainObjectMessageException if POJO passed', () => {
      expect(() => ExecutorUtils.getTypeOfMessage({ property: true })).toThrow(PlainObjectMessageException);
    });
  });
});
