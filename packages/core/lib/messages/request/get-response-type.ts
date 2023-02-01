import { ResponseType } from './constants';

export type GetResponseType<Request extends { [k: PropertyKey]: any }> = Request[typeof ResponseType] extends
  | object
  | undefined
  ? Request[typeof ResponseType]
  : unknown;
