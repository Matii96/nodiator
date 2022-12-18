import { Injectable } from '@nestjs/common';
import { IRequestHandler, RequestHandler } from '@nodiator/core';

export class TestRequest {}

@RequestHandler({ request: TestRequest, scoped: true })
export class TestRequestHandler implements IRequestHandler<TestRequest, void> {
  async handle() {}
}

@Injectable()
export class ModuleConfigurator implements MediatorOptionsFactory {
  createMediatorOptions() {
    return { config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }) };
  }
}
