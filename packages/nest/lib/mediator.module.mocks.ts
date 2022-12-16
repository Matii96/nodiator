import { Injectable } from '@nestjs/common';
import { RequestHandler, MediatorLoggingLevels, RequestHandler } from '@nodiator/core';
import { MediatorOptionsFactory } from './options';

export class TestRequest {}

@RequestHandler({ request: TestRequest, scoped: true })
export class TestRequestHandler implements RequestHandler<TestRequest, void> {
  async handle() {}
}

@Injectable()
export class ModuleConfigurator implements MediatorOptionsFactory {
  createMediatorOptions() {
    return { config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }) };
  }
}
