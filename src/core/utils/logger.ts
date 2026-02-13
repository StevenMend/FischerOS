const isDev = import.meta.env.DEV;

export const logger = {
  debug: (ctx: string, msg: string, data?: unknown) => isDev && console.log(`[${ctx}]`, msg, data),
  info: (ctx: string, msg: string, data?: unknown) => isDev && console.log(`[${ctx}]`, msg, data),
  warn: (ctx: string, msg: string, data?: unknown) => isDev && console.warn(`[${ctx}]`, msg, data),
  error: (ctx: string, msg: string, data?: unknown) => console.error(`[${ctx}]`, msg, data),
};
