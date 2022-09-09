import { Injectable } from '@nestjs/common';
import { IRequestHandler, MediatorLoggingLevels, RequestHandler } from '@nodiator/core';
import { IMediatorOptionsFactory } from './options';

export class TestRequest {}

@RequestHandler({ request: TestRequest, scoped: true })
export class TestRequestHandler implements IRequestHandler<TestRequest, void> {
  async handle() {}
}

@Injectable()
export class ModuleConfigurator implements IMediatorOptionsFactory {
  createMediatorOptions() {
    return { config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }) };
  }
}
