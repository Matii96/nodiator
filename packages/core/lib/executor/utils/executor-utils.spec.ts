import { TestRequest } from '../../messages/request/messages.mocks';
import { PlainObjectMessageException } from '../exceptions';
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

  describe('decide if object is promise', () => {
    it('should recognize promise', () => {
      expect(ExecutorUtils.isPromise(new Promise<void>((resolve) => resolve()))).toBe(true);
    });

    it('should not recognize promise', () => {
      expect(ExecutorUtils.isPromise('test')).toBe(false);
    });
  });
});
