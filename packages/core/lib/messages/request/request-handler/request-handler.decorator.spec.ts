import 'reflect-metadata';
import { MESSAGE_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { MessageTypeInterferenceException } from '../../exceptions/message-type-interference.exception';
import { ScopeOptions } from '../../interfaces';
import { MessageMetadata } from '../../interfaces/message-metadata.interface';
import { MessageTypes } from '../../message-types.enum';
import { REQUEST_HANDLER_METADATA } from '../constants';
import { TestRequest, TestRequestHandler } from '../requests.mocks';
import { RequestHandler } from './request-handler.decorator';

describe('RequestHandler', () => {
  beforeEach(() => {
    Reflect.defineMetadata(MESSAGE_METADATA, undefined, TestRequest);
  });

  describe('requests registration', () => {
    it('should register handler for request', () => {
      RequestHandler(TestRequest)(TestRequestHandler);

      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestRequestHandler)).toBeUndefined();
      expect(Reflect.getMetadata(REQUEST_HANDLER_METADATA, TestRequestHandler)).toEqual(TestRequest);
      expect(Reflect.getMetadata(MESSAGE_METADATA, TestRequest)).toEqual({
        type: MessageTypes.REQUEST,
      } as MessageMetadata);
    });

    it('should throw MessageTypeInterferenceException', () => {
      Reflect.defineMetadata(MESSAGE_METADATA, { type: MessageTypes.EVENT } as MessageMetadata, TestRequest);
      expect(() => RequestHandler(TestRequest)(TestRequestHandler)).toThrow(MessageTypeInterferenceException);
    });
  });

  describe('scoping', () => {
    it('should register provider as scoped', () => {
      RequestHandler({ request: TestRequest, scoped: true })(TestRequestHandler);
      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestRequestHandler)).toEqual({ scoped: true } as ScopeOptions);
    });
  });
});
