type LogMeta = Record<string, unknown>;

function log(level: string, message: string, meta?: LogMeta): void {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    log('info', message, meta);
  },
  warn(message: string, meta?: LogMeta): void {
    log('warn', message, meta);
  },
  error(message: string, meta?: LogMeta): void {
    log('error', message, meta);
  }
};
