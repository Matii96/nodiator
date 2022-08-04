import { IExecutor } from './ports/executor.port';

export class ExecutorMock implements IExecutor {
  execute = jest.fn();
}
