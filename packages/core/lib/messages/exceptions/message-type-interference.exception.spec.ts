import { TestRequest } from '../request/requests.mocks';
import { MessageTypeInterferenceException } from './message-type-interference.exception';

describe('MessageTypeInterferenceException', () => {
  it('should format message', () => {
    const exception = new MessageTypeInterferenceException(TestRequest);
    expect(exception.message).toContain(TestRequest.name);
  });
});
