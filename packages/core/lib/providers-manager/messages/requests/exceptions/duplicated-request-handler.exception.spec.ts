import { TestRequest } from '../../../../messages/messages.mocks';
import { DuplicatedRequestHandlerException } from './duplicated-request-handler.exception';

describe('DuplicatedRequestHandlerException', () => {
  it('should format message', () => {
    const exception = new DuplicatedRequestHandlerException(TestRequest);
    expect(exception.message).toContain(TestRequest.name);
  });
});
