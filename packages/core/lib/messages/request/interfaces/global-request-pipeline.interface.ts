import { IRequest } from './request.interface';

export interface IGlobalRequestPipeline {
  handle(request: IRequest, next: () => Promise<unknown>): Promise<unknown>;
}
