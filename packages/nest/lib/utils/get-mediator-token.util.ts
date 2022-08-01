import { GLOBAL_NAMESPACE } from '../constants';

export const getMediatorToken = (namespace = GLOBAL_NAMESPACE) => `Nodiator_${namespace}`;
