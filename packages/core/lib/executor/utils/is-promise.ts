export const isPromise = (p: any) => p && typeof p === 'object' && typeof p.then === 'function';
