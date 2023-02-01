import { TestRequest } from '../../messages/request/requests.mocks';
import { PlainObjectMessageException } from '../exceptions';
import { getTypeOfMessage } from './get-type-of-message';

describe('getTypeOfMessage', () => {
  it('should get prototype of object', () => {
    expect(getTypeOfMessage(new TestRequest())).toBe(TestRequest);
  });

  it('should throw PlainObjectMessageException if POJO passed', () => {
    expect(() => getTypeOfMessage({ property: true })).toThrow(PlainObjectMessageException);
  });
});
