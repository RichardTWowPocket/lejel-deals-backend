"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
class CustomLogger {
    logLevels = ['log', 'error', 'warn', 'debug', 'verbose'];
    log(message, context) {
        this.printMessage('log', message, context);
    }
    error(message, trace, context) {
        this.printMessage('error', message, context);
        if (trace) {
            this.printMessage('error', trace, context);
        }
    }
    warn(message, context) {
        this.printMessage('warn', message, context);
    }
    debug(message, context) {
        this.printMessage('debug', message, context);
    }
    verbose(message, context) {
        this.printMessage('verbose', message, context);
    }
    printMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? `[${context}]` : '';
        const levelStr = level.toUpperCase().padEnd(7);
        console.log(`${timestamp} ${levelStr} ${contextStr} ${message}`);
    }
}
exports.CustomLogger = CustomLogger;
//# sourceMappingURL=logger.config.js.map