import { IMediatorLogger } from '../mediator-logger/mediator-logger.port';
import { MediatorLoggingLevels } from './logging-levels.enum';

export class LoggingLevelProxy implements IMediatorLogger {
  private readonly _acceptedLevels = [
    MediatorLoggingLevels.DEBUG,
    MediatorLoggingLevels.INFO,
    MediatorLoggingLevels.WARN,
    MediatorLoggingLevels.ERROR,
    MediatorLoggingLevels.NONE,
  ] satisfies MediatorLoggingLevels[];

  constructor(
    private readonly _base: IMediatorLogger,
    private readonly _dynamicOptions: () => { level?: MediatorLoggingLevels }
  ) {}

  debug(msg: string) {
    if (this.getLevel() === MediatorLoggingLevels.DEBUG) this._base.debug(msg);
  }

  info(msg: string) {
    if (this._acceptedLevels.slice(0, 2).includes(this.getLevel())) this._base.info(msg);
  }

  warn(msg: string) {
    if (this._acceptedLevels.slice(0, 3).includes(this.getLevel())) this._base.warn(msg);
  }

  error(msg: string) {
    if (this._acceptedLevels.slice(0, 4).includes(this.getLevel())) this._base.error(msg);
  }

  private getLevel() {
    return this._dynamicOptions().level ?? MediatorLoggingLevels.INFO;
  }
}
