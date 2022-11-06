import { Type } from '../../../utils/type.interface';
import { MediatorLoggingLevels } from '../../../config';
import { IMediatorLogger, MediatorOptions } from '../../../config/mediator.options';

export abstract class SharedErrorLoggingBehaviour {
  private readonly _levelsDict: Record<MediatorLoggingLevels, (msg: string) => void>;

  constructor(protected readonly _logger: IMediatorLogger, protected readonly _options: MediatorOptions) {
    this._levelsDict = {
      [MediatorLoggingLevels.DEBUG]: this._logger.debug.bind(this._logger),
      [MediatorLoggingLevels.INFO]: this._logger.info.bind(this._logger),
      [MediatorLoggingLevels.WARN]: this._logger.warn.bind(this._logger),
      [MediatorLoggingLevels.ERROR]: this._logger.error.bind(this._logger),
      [MediatorLoggingLevels.NONE]: () => undefined,
    };
  }

  protected log(error: Error, msg: string) {
    if (!this._options.exceptionsLoggingLevels) {
      return this._logger.error(msg);
    }

    for (const level in this._options.exceptionsLoggingLevels) {
      const levelExceptions = this._options.exceptionsLoggingLevels[level as MediatorLoggingLevels] as Type<Error>[];
      if (!levelExceptions.some((exception) => error instanceof exception)) {
        continue;
      }
      return this._levelsDict[level as MediatorLoggingLevels](msg);
    }

    // No custom level found
    this._logger.error(msg);
  }
}
