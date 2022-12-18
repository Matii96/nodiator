import { MediatorLoggingLevels } from '../logging-level/logging-levels.enum';
import { ClassConstructor } from '../utils/class-constructor.interface';

export type ExceptionsLoggingLevels = Partial<Record<MediatorLoggingLevels, ClassConstructor<Error>[]>>;
