import * as log4js from "log4js";

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'file',
      filename: 'output/consoleLog.log',
      maxLogSize: 10485760, // 10MB
      backups: 10,
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: 'debug'
    }
  }
});

const logger = log4js.getLogger();

export function startScenario (scenarioTitle: string): void {
  logger.info("=============== Test Started ===============")
  logger.info(scenarioTitle)
  logger.info('--------------------------------------------')
}

export function endScenario(): void {
 logger.info("=============== Test Ended ===============\n\n")
}

export function log(message: string): void {
  logger.info(message)
}

export function error(message: string): void {
  logger.error(message)
}