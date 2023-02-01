export const MessageTypes = {
  REQUEST: 0,
  EVENT: 1,
} as const;

export type MessageTypes = (typeof MessageTypes)[keyof typeof MessageTypes];
