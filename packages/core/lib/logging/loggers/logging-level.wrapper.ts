import { IMediatorLogger, MediatorLoggingLevels } from '../../mediator/mediator.options';

export class LoggingLevelWrapper implements IMediatorLogger {
  private readonly _acceptedLevels: MediatorLoggingLevels[] = ['debug', 'info', 'warn', 'error'];

  constructor(private readonly base: IMediatorLogger, private readonly level: MediatorLoggingLevels) {}

  debug(msg: string) {
    if (this.level === 'debug') this.base.debug(msg);
  }

  info(msg: string) {
    if (this._acceptedLevels.slice(0, 2).includes(this.level)) this.base.info(msg);
  }

  warn(msg: string) {
    if (this._acceptedLevels.slice(0, 3).includes(this.level)) this.base.warn(msg);
  }

  error(msg: string) {
    if (this._acceptedLevels.includes(this.level)) this.base.error(msg);
  }
}
