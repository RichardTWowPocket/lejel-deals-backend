import { LoggerService, LogLevel } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  log(message: any, context?: string) {
    this.printMessage('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage('error', message, context);
    if (trace) {
      this.printMessage('error', trace, context);
    }
  }

  warn(message: any, context?: string) {
    this.printMessage('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.printMessage('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.printMessage('verbose', message, context);
  }

  private printMessage(level: LogLevel, message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const levelStr = level.toUpperCase().padEnd(7);
    
    console.log(`${timestamp} ${levelStr} ${contextStr} ${message}`);
  }
}