import { IMediatorLogger } from '../mediator-logger.port';

export class DefaultMediatorLogger implements IMediatorLogger {
  private standardizeMessage(msg: string) {
    return `[Mediator] ${msg}`;
  }

  debug(msg: string) {
    console.debug(this.standardizeMessage(msg));
  }

  info(msg: string) {
    console.log(this.standardizeMessage(msg));
  }

  warn(msg: string) {
    console.warn(this.standardizeMessage(msg));
  }

  error(msg: string) {
    console.error(this.standardizeMessage(msg));
  }
}
