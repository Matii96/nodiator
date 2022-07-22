import { IRequest } from './request.interface';

export interface IRequestPipeline<TRequest extends IRequest, TResult> {
  handle(request: TRequest, next: () => Promise<TResult>): Promise<TResult>;
}
