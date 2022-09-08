import { MediatorLoggingLevels } from '../../config/mediator.config';
import { MediatorConfigurator } from '../../config/mediator.configurator';
import { IMediatorLogger } from '../../config/mediator.options';

export class LoggingLevelWrapper implements IMediatorLogger {
  private readonly _acceptedLevels: MediatorLoggingLevels[] = [
    MediatorLoggingLevels.DEBUG,
    MediatorLoggingLevels.INFO,
    MediatorLoggingLevels.WARN,
    MediatorLoggingLevels.ERROR,
  ];

  constructor(private readonly _base: IMediatorLogger, private readonly _config: MediatorConfigurator) {}

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
    if (this._acceptedLevels.includes(this.getLevel())) this._base.error(msg);
  }

  private getLevel() {
    return this._config().logs?.level || MediatorLoggingLevels.INFO;
  }
}
