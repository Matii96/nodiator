import { IMediatorLogger } from '../../mediator/mediator.options';
import { DefaultMediatorLogger } from './default.mediator-logger';

describe('DefaultMediatorLogger', () => {
  const msg = 'some message';
  let logger: IMediatorLogger;

  beforeEach(() => {
    logger = new DefaultMediatorLogger();
  });

  it('should print debug log', () => {
    jest.spyOn(console, 'debug').mockReturnValueOnce(undefined);
    logger.debug(msg);
    expect(console.debug).toHaveBeenCalledWith(`[Mediator] ${msg}`);
  });

  it('should print info log', () => {
    jest.spyOn(console, 'log').mockReturnValueOnce(undefined);
    logger.info(msg);
    expect(console.log).toHaveBeenCalledWith(`[Mediator] ${msg}`);
  });

  it('should print warn log', () => {
    jest.spyOn(console, 'warn').mockReturnValueOnce(undefined);
    logger.warn(msg);
    expect(console.warn).toHaveBeenCalledWith(`[Mediator] ${msg}`);
  });

  it('should print error log', () => {
    jest.spyOn(console, 'error').mockReturnValueOnce(undefined);
    logger.error(msg);
    expect(console.error).toHaveBeenCalledWith(`[Mediator] ${msg}`);
  });
});
