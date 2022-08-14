import { TestRequest } from '../../../../messages/messages.mocks';
import { NoHandlerException } from './no-handler.exception';

describe('NoHandlerException', () => {
  it('should format message', () => {
    const exception = new NoHandlerException(TestRequest);
    expect(exception.message).toContain(TestRequest.name);
  });
});
