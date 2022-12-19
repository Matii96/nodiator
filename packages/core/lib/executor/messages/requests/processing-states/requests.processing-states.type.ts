import { HandlingCompletedRequestProcessingState } from './handling-completed.request.processing-state';
import { HandlingErrorRequestProcessingState } from './handling-error.request.processing-state';
import { HandlingStartedRequestProcessingState } from './handling-started.request.processing-state';
import { PipelineErrorRequestProcessingState } from './pipeline-error.request.processing-state';

export type RequestsProcessingStates =
  | HandlingStartedRequestProcessingState
  | HandlingErrorRequestProcessingState
  | HandlingCompletedRequestProcessingState
  | PipelineErrorRequestProcessingState;
