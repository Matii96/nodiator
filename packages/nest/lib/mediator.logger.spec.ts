import { MediatorLogger } from './mediator.logger';

describe('MediatorLogger', () => {
  let logger: MediatorLogger;

  beforeEach(() => {
    logger = new MediatorLogger();
  });

  it('should log info message', () => {
    jest.spyOn(logger, 'log').mockReturnValueOnce(undefined);
    logger.info('test');
    expect(logger.log).toHaveBeenCalledTimes(1);
  });
});
