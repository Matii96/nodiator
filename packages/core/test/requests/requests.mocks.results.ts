import { MessageTypes, MessageTimeoutException, IRequestProcessingState } from '../../lib';
import {
  TestRequest,
  TestGlobalRequestPipeline,
  TestRequestHandler,
  TestRequestPipeline,
  TestLaggingRequestPipeline,
} from './requests.mocks';

export const handlingSteps = (id: string, testRequest: TestRequest): IRequestProcessingState[] => [
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestGlobalRequestPipeline(),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestRequestPipeline(),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestRequestHandler(),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestRequestHandler(),
    response: { value: testRequest.property },
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestRequestPipeline(),
    response: { value: testRequest.property },
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestGlobalRequestPipeline(),
    response: { value: testRequest.property },
  },
  {
    id,
    message: testRequest,
    messageType: MessageTypes.REQUEST,
    processed: true,
  },
];

export const timeoutSteps = (id: string, testRequest: TestRequest): IRequestProcessingState[] => [
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestGlobalRequestPipeline(),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestRequestPipeline(),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    provider: new TestLaggingRequestPipeline(),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    error: new MessageTimeoutException(testRequest),
  },
  {
    id,
    messageType: MessageTypes.REQUEST,
    message: testRequest,
    processed: true,
  },
];
