import { IMediatorLogger, MediatorLoggingLevels } from '../../mediator.options';

export class LoggingLevelWrapper implements IMediatorLogger {
  private readonly _acceptedLevels = [
    MediatorLoggingLevels.DEBUG,
    MediatorLoggingLevels.INFO,
    MediatorLoggingLevels.WARN,
    MediatorLoggingLevels.ERROR,
  ];

  constructor(private readonly base: IMediatorLogger, private readonly level: MediatorLoggingLevels) {}

  debug(msg: string) {
    if (this.level === MediatorLoggingLevels.DEBUG) this.base.debug(msg);
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
